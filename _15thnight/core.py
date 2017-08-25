from datetime import datetime, timedelta
from flask import current_app, render_template, request, url_for
from flask_login import current_user
from flask_mail import Message

from _15thnight.queue import enqueue_send_message, enqueue_send_email
from _15thnight.models import (
    Alert, Need, Pledge, ProviderNotified, Service, Response, User
)


def send_out_alert(data):
    """
    Send out an alert to providers.
    """
    alert = Alert(
        description=data['description'],
        gender=data['gender'],
        age=data['age'],
        user=current_user,
    ).save()

    needs = []
    # An array of objects mapping a need model to the service model
    need_services = []
    for service in Service.get_by_ids(data['needs']):
        need = Need(
            alert=alert,
            service_name=service.name,
            service_description=service.description,
            category_name=service.category.name,
            category_description=service.category.description
        ).save()
        need_services.append(dict(need=need, service=service))
        needs.append(need)

    for provider in User.providers_with_services(data['needs']):
        applicable_needs = [
            need_service['need'] for need_service in need_services
            if need_service['service'] in provider.services
        ]
        gender = alert.get_gender()
        need_list = ", ".join([need.service_name for need in applicable_needs])
        body = ('New 15th night alert!\n'
                '%d y/o%s\n'
                'Needs: %s\n'
                'Desc: %s\n'
                'Respond at %sr/%s') % (
                    alert.age, gender, need_list, data['description'],
                    url_for('index', _external=True), str(alert.id)
                )
        ProviderNotified(
            provider=provider,
            alert=alert,
            needs=applicable_needs
        ).save()
        enqueue_send_message(provider.email, provider.phone_number,
                             '15th Night Alert', body)


def respond_to_alert(provider, pledges, alert):
    """
    Send a response from a provider to an advocate.
    A response contains a series of pledges. Plegdes are a pledge to fulfill
    one alert need.
    """
    advocate = alert.user

    body = provider.email
    if provider.phone_number:
        body += ", %s" % provider.phone_number

    response = Response(user=provider, alert=alert)

    pledged_services = []
    for pledge in pledges:
        need = Need.get(pledge['need_id'])
        message = pledge['message']
        Pledge(
            need=need,
            response=response,
            message=message,
            provider=provider,
            alert=alert
        ).save(False)
        pledged_services.append('%s: %s\n' % (need.service_name, message))

    response.save()

    body += (" is availible for:\n\n" + "\n".join(pledged_services))

    enqueue_send_message(advocate.email, advocate.phone_number,
                         '15th Night Alert Response', body)

    return response


def resolve_need(need):
    """
    Resolve a need and trigger an alert closed if necessary.
    """
    alert = need.alert
    advocate = alert.user
    message = ''
    if need.resolve_message != '':
        message = '\nMsg: ' + need.resolve_message
    gender = alert.get_gender()
    args = (advocate.name, advocate.organization,
            need.service_name, alert.age, gender)
    accepted = ('15th Night help accepted!\n'
                '%s with %s selected you to provide %s for a '
                '%d y/o%s%s') % (args + (message,))
    denied = ('15th Night help not needed\n'
              '%s with %s does not need your help to provide %s for a '
              '%d y/o%s') % args

    selected = set([p.response.user_id for p in need.pledges if p.selected])
    users = set(map(lambda pledge: pledge.response.user, need.pledges))

    for provider in users:
        body = accepted if provider.id in selected else denied
        enqueue_send_message(provider.email, provider.phone_number,
                             '15th Night Need Resolution', body)
    # Check if alert is closed, if so, send out resolution notices
    _send_alert_resolution_notice(need)


def _send_alert_resolution_notice(need):
    """
    Check if need.alert is closed and trigger an alert closed notification.
    """
    if need.alert.is_closed:
        alert = need.alert
        gender = alert.get_gender()
        created = alert.created_at.strftime("%m/%d at %I:%M %p")
        body = (
            "Alert sent on %s for a %syo%s has been closed."
            "\nSee: %s"
            % (created, alert.age, gender, alert.url))
        providers = [notified.provider for notified in alert.notified]
        subject = "Alert has been closed."

        for provider in providers:
            enqueue_send_message(provider.email, provider.phone_number,
                                 subject, body)


def send_password_reset(user):
    """
    Send password reset link to user.
    """
    token_life = abs(current_app.config.get('RESET_TOKEN_LIFE', 24))
    reset_expiration = datetime.utcnow() - timedelta(hours=token_life)
    if not user.reset_token or user.reset_created_at < reset_expiration:
        user.generate_reset_token()
        user.save()
    link = '%sreset-password/%s/%s' % (
        url_for('index', _external=True), user.email, user.reset_token
    )
    message = Message(
        subject='15th Night Password Reset Link',
        body=render_template('email/reset_instructions.txt', link=link),
        html=render_template('email/reset_instructions.html', link=link),
        recipients=[user.email]
    )
    enqueue_send_email(message)


def send_confirm_password_reset(user):
    """
    Send confirmation of password reset.
    """
    data = dict(
        time=datetime.utcnow().strftime('%m/%d/%y %I:%M%p'),
        ip=request.remote_addr
    )
    message = Message(
        subject='15th Night Password was Reset',
        body=render_template('email/reset_notice.txt', **data),
        html=render_template('email/reset_notice.html', **data),
        recipients=[user.email]
    )
    enqueue_send_email(message)


def send_help_message(user, message):
    """
    Send a help message.
    """
    sender = (user.name or '', user.email)
    message = Message(
        sender=sender,
        reply_to=sender,
        subject="15th Night RAN Website Support Request",
        body=render_template(
            'email/support_request.txt', provider=user, message=message),
        recipients=[current_app.config.get('SUPPORT_EMAIL', '')]
    )
    enqueue_send_email(message)


def send_out_alert_closed(alert):
    #TODO: Better date formatting
    #TODO: Send out which needs were just resolved, to the outstanding providers
    gender = '' if alert.gender == 'unspecified' else ' ' + alert.gender
    body = ('15th Night was alert closed.\n'
            'Alert for %d y/o%s sent on %d/%d is now closed.\n') % \
            (alert.age, gender, alert.created_at.month, alert.created_at.day)

    providers = set(
        [notified.provider for notified in alert.providers_notified]
    )

    for provider in providers:
        queue_send_message.apply_async(
            kwargs=dict(
                email=provider.email,
                number=provider.phone_number,
                subject='15th Night Alert Closed',
                body=body
            )
        )
