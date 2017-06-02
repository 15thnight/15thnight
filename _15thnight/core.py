from datetime import datetime, timedelta
from flask import current_app, render_template, request, url_for
from flask.ext.login import current_user
from flask_mail import Message

from _15thnight.queue import queue_send_message, queue_send_email
from _15thnight.models import (
    Alert, Need, NeedProvided, ProviderNotified, Service, Response, User
)


def send_out_alert(alert_form):
    """
    Send out an alert to providers.
    """
    alert = Alert(
        description=alert_form.description.data,
        gender=alert_form.gender.data,
        age=alert_form.age.data,
        user=current_user,
    )
    alert.save()
    need_ids = alert_form.needs.data
    for service in Service.get_by_ids(need_ids):
        need = Need(alert=alert, service=service)
        need.save()
    providers = User.providers_with_services(need_ids)
    for provider in providers:
        needs_provided = [
            need_ for need_ in provider.services if need_.id in need_ids
        ]
        gender = alert.get_gender()
        needs = ", ".join(
            [need_provided.name for need_provided in needs_provided])
        body = ('New 15th night alert!\n'
                '%d y/o%s\n'
                'Needs: %s\n'
                'Desc: %s\n'
                'Respond at %sr/%s') % (
                    alert.age, gender, needs,
                    alert_form.description.data,
                    url_for('index', _external=True), str(alert.id)
                )
        provider_notified = ProviderNotified(
            provider=provider,
            alert=alert,
            needs=Need.get_by_ids([need_id.id for need_id in needs_provided])
        )
        # TODO: test
        provider_notified.save()
        queue_send_message.apply_async(
            kwargs=dict(
                email=provider.email,
                number=provider.phone_number,
                subject='15th Night Alert',
                body=body
            )
        )


def respond_to_alert(provider, needs_provided, alert):
    """
    Send a response from a provider to an advocate.
    """
    advocate = alert.user

    body = provider.email
    if provider.phone_number:
        body += ", %s" % provider.phone_number

    response = Response(user=provider, alert=alert)
    response.save()

    services_provided = []
    for provision in needs_provided:
        need = Need.get(provision['need_id'])
        need_provided = NeedProvided(
            need=need,
            response=response,
            message=provision['message']
        )
        need_provided.save()
        services_provided.append(
            '%s: %s\n' % (need.service.name, provision['message'])
        )

    body += (" is availible for:\n\n%s") % (
        "\n".join(services_provided))

    queue_send_message.apply_async(
        kwargs=dict(
            email=advocate.email,
            number=advocate.phone_number,
            subject='15th Night Alert Response',
            body=body
        )
    )

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
            need.service.name, alert.age, gender)
    accepted = ('15th Night help accepted!\n'
                '%s with %s selected you to provide %s for a '
                '%d y/o%s%s') % (args + (message,))
    denied = ('15th Night help not needed\n'
              '%s with %s does not need your help to provide %s for a '
              '%d y/o%s') % args

    selected = set()
    users = set(map(
        lambda provision: provision.response.user, need.provisions))
    for provision in need.provisions:
        if provision.selected:
            selected.add(provision.response.user_id)

    for provider in users:
        body = accepted if provider.id in selected else denied
        queue_send_message.apply_async(
            kwargs=dict(
                email=advocate.email,
                number=advocate.phone_number,
                subject='15th Night Need Resolution',
                body=body
            )
        )
    # Check if alert is closed, if so, send out resolution notices
    _send_alert_resolution_notice(need)


def _send_alert_resolution_notice(need):
    """
    Check if need.alert is closed and trigger an alert closed notification.
    """
    if need.alert.is_closed:
        alert = need.alert
        age = alert.age
        gender = alert.get_gender()
        created = alert.created_at.strftime("%m/%d at %I:%M %p")
        body = (
            "Alert sent on %s for a %syo%s has been closed."
            "\nSee: %s"
            % (created, age, gender, alert.url))
        providers = [
            provider_notified.provider for provider_notified
            in alert.providers_notified
        ]
        subject = "Alert has been closed."

        for provider in providers:
            queue_send_message.apply_async(args=[
                provider.email, provider.phone_number, subject, body])


def send_password_reset(user):
    """
    Send password reset link to user.
    """
    reset_token_life = timedelta(
        hours=current_app.config.get('RESET_TOKEN_LIFE', 24))
    if (not user.reset_token or
            user.reset_created_at < datetime.utcnow() - reset_token_life):
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
    queue_send_email.apply_async(kwargs=dict(message=message))


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
    queue_send_email.apply_async(kwargs=dict(message=message))


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
    queue_send_email.apply_async(kwargs=dict(message=message))


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
