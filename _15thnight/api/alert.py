from flask import Blueprint, request
from flask.ext.login import current_user, login_required

from _15thnight.core import send_out_alert, send_out_alert_closed
from _15thnight.forms import AlertForm
from _15thnight.models import Alert
from _15thnight.util import required_access, jsonify, api_error


alert_api = Blueprint('alert_api', __name__)


@alert_api.route('', methods=['GET'])
@login_required
def get_alerts():
    """
    Gets list of a alerts.
    Admin gets a list of all results.
    Provider gets a list of their outstanding alerts.
    Advocate gets a list of their sent alerts.
    """
    # TODO: pagination
    if current_user.role == 'advocate':
        alerts = Alert.get_advocate_alerts(current_user)
    elif current_user.role == 'provider':
        scope = request.args.get('scope')
        if scope == 'all':
            alerts = Alert.get_provider_alerts(current_user)
        elif scope == 'responded':
            alerts = Alert.get_responded_alerts_for_provider(current_user)
        else:
            alerts = Alert.get_active_alerts_for_provider(current_user)
    else:
        alerts = Alert.get_admin_alerts()
    return jsonify(alerts)


@alert_api.route('/<int:alert_id>', methods=['GET'])
@login_required
def get_alert(alert_id):
    alert = Alert.get(alert_id)
    if not alert:
        return api_error('Alert not found')
    if current_user.role == 'provider':
        if not alert.provider_has_permission(current_user):
            return api_error('Permission denied')
        data = alert.to_provider_json(current_user)
    elif current_user.role == 'advocate':
        if alert.user.id != current_user.id:
            return api_error('Permission denied')
        data = alert.to_advocate_json()
    else: # is an admin
        data = alert.to_advocate_json()
    return jsonify(data)


@alert_api.route('', methods=['POST'])
@required_access('advocate')
def create_alert():
    """
    Create an alert. Must be an advocate.
    """
    form = AlertForm()
    if not form.validate_on_submit():
        return api_error(form.errors)

    send_out_alert(form)
    return '', 201


@alert_api.route('/<int:id>', methods=['PUT'])
@required_access('advocate')
def update_alert(id):
    """
    Update an alert.
    """
    return 'Not Implemented', 501


@alert_api.route('/<int:id>', methods=['DELETE'])
@required_access('advocate', 'admin')
def delete_alert(id):
    """
    Delete an alert.
    """
    return 'Not Implemented', 501  # We do not support a UI for this
    if current_user.role == 'advocate':
        alert = Alert.get_user_alert(current_user, id)
    else:
        alert = Alert.get(id)
    if not alert:
        return api_error('No alert was found.', 404)

    alert.delete()
    return '', 200

@alert_api.route('/<int:alert_id>/resolve-all-needs', methods=['POST'])
@required_access('admin')
def resolve_all_alert_needs(alert_id):
    alert = Alert.get(alert_id)
    if not alert:
        return api_error('Alert not found')

    for need in alert.needs:
        need.resolved = True
        need.save(False)

    alert.save()

    if ('notifyProvidersAllResolved' in request.json and
        request.json['notifyProvidersAllResolved']):
        send_out_alert_closed(alert)

    return '', 200
