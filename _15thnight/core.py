from flask.ext.login import current_user

from _15thnight.queue import queue_send_message
from _15thnight.email_client import send_email
from _15thnight.models import Alert, Category, Response, User
from _15thnight.twilio_client import send_sms

try:
    from config import HOST_NAME
except:
    from configdist import HOST_NAME


def send_out_alert(alert_form):
    """
    Send out an alert to providers.
    """
    alert = Alert(
        description=alert_form.description.data,
        gender=alert_form.gender.data,
        age=alert_form.age.data,
        user=current_user,
        categories=Category.get_by_ids(alert_form.needs.data)
    )
    alert.save()
    providers = User.users_in_categories(alert_form.needs.data)
    for user in providers:
        body = ('%s, there is a new 15th night alert.\n'
                'Go to %s/respond_to/%s to respond.') % (
                    user.email, HOST_NAME, str(alert.id))
        queue_send_message.apply_async(
            kwargs=dict(
                email=user.email,
                number=user.phone_number,
                subject='15th Night Alert',
                body=body
            )
        )


def respond_to_alert(provider, message, alert):
    """
    Send a response from a provider to an advocate.
    """
    advocate = alert.user

    body = provider.email
    if provider.phone_number:
        body += ", %s" % provider.phone_number

    needs = [ cat.id for cat in alert.categories ]
    abilities = [
        cat.name for cat in provider.categories if cat.id in needs ]

    body += (" is availble for: %s\nMessage: %s") % (
        ", ".join(abilities), message)

    queue_send_message.apply_async(
        kwargs=dict(
            email=provider.email,
            number=provider.phone_number,
            subject='15th Night Alert Response',
            body=body
        )
    )

    response = Response(user=provider, alert=alert, message=message)
    response.save()
    return response
