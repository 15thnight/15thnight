import re

from flask.ext.login import current_user

from _15thnight.queue import queue_send_message
from _15thnight.models import Alert, Service, Response, User

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
        needs=Service.get_by_ids(alert_form.needs.data)
    )
    alert.save()
    providers = User.providers_with_services(alert_form.needs.data)
    for user in providers:
        body = ('%s, there is a new 15th night alert.\n'
                'Go to %s/respond-to/%s to respond.') % (
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
    body = provider.email
    if provider.phone_number:
        body += ", %s" % provider.phone_number

    needs = [service.id for service in alert.needs]
    services = [
        service.name for service in provider.services if service.id in needs
    ]

    body += (" is availble for: %s\nMessage: %s") % (
        ", ".join(services), message)

    queue_send_message.apply_async(
        kwargs=dict(
            email=advocate.email,
            number=advocate.phone_number,
            subject='15th Night Alert Response',
            body=body
        )
    )

    try:
        response = Response(user=provider, alert=alert, message=message)
        response.save()
        return response
    except:
        return None


def validate_text_response(msg):
    """
    Parse incoming response text and generate reply.

    Example acceptable responses look like:
        - yes 53
        - y 53
        - 18 yes
        - 18 y

    Numbers are alert IDs sent in the initial text
    """
    # One or more numeric matches
    alert = "(\d+)"
    # match y or yes
    yes = "(?:y|yes)"
    # alert_id - yes
    ay = "%s\s+%s" % (alert, yes)
    # yes - alert_id
    ya = "%s\s+%s" % (yes, alert)

    # Search for both formats in text
    ay_acceptable = re.search("%s(.*)" % ay, msg)
    ya_acceptable = re.search("%s(.*)" % ya, msg)

    acceptable = ay_acceptable if ay_acceptable else ya_acceptable

    # Prep data to return with
    parsed_response = dict({
        "alert_id": None,
        "message": "",
    })

    # Grab the proper regex capture group based on text format
    if acceptable:
        parsed_response["alert_id"] = acceptable.groups()[0]
        parsed_response["message"] = acceptable.groups()[1]

    # Return the parsed message or a dict with None type values
    return parsed_response
