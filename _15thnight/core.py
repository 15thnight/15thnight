from flask.ext.login import current_user

from _15thnight.queue import queue_send_message
from _15thnight.models import (
    Alert, Need, NeedProvided, ProviderNotified, Service, Response, User
)

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
    )
    alert.save()
    need_ids = alert_form.needs.data
    for service in Service.get_by_ids(need_ids):
        need = Need(alert=alert, service=service)
        need.save()
    providers = User.providers_with_services(need_ids)
    for provider in providers:
        needs_provided = [
            need for need in provider.services if need.id in need_ids
        ]
        gender = ' ' + alert.gender if alert.gender != 'unspecified' else ''
        needs = ", ".join([need.name for need in needs_provided])
        body = ('New 15th night alert!\n'
                '%d y/o%s\n'
                'Needs: %s\n'
                'Desc: %s\n'
                'Respond at %s/r/%s') % (
                    alert.age, gender, needs,
                    alert_form.description.data, HOST_NAME, str(alert.id)
                )
        provider_notified = ProviderNotified(
            provider=provider,
            alert=alert,
            needs=Need.get_by_ids([need.id for need in needs_provided])
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
