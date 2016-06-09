from flask.ext.login import current_user

from _15thnight.queue import queue_send_alert
from _15thnight.email_client import send_email
from _15thnight.models import Alert, User
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
        other=alert_form.other.data,
        shelter=alert_form.shelter.data,
        food=alert_form.food.data,
        clothes=alert_form.clothes.data,
        gender=alert_form.gender.data,
        age=alert_form.age.data,
        user=current_user
    )
    alert.save()
    providers = User.get_providers(
        alert.food, alert.clothes, alert.shelter, alert.other
    )
    for user in providers:
        body = ('%s, there is a new 15th night alert.\n'
                'Go to %s/respond_to/%s to respond.') % \
                (user.email, HOST_NAME, str(alert.id))
        queue_send_alert(
            email=user.email, number=user.phone_number, body=body
        )

def respond_to_alert(provider, message, alert):
    """
    Send a response from a provider to an advocate.
    """
    advocate = alert.user

    response_message = "%s" % provider.email
    if provider.phone_number:
        response_message += ", %s" % provider.phone_number

    response_message += " is availble for: "
    available = dict(
        shelter=provider.shelter,
        clothes=provider.clothes,
        food=provider.food,
        other=provider.other
    )

    response_message += "%s" % ", ".join(k for k, v in available.items() if v)
    response_message += " Message: " + submitted_message

    if advocate.phone_number:
        send_sms(
            alert.user,
            response_message
        )

    send_email(
        to=advocate.email,
        subject='Alert Response',
        body=response_message
    )

    response = Response(user=provider, alert=alert, message=message)
    response.save()
    return response