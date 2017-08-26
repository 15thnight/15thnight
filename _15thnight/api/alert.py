from datetime import datetime

from flask import Blueprint, jsonify, request as r
from flask_login import current_user, login_required

from _15thnight.core import send_out_alert, send_out_alert_closed
from _15thnight.marshal import marshal_alert
from _15thnight.models import Alert
from _15thnight.schema import alert_schema
from _15thnight.util import app_error, api_error, required_access, validate


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
        scope = r.args.get('scope')
        if scope == 'all':
            alerts = Alert.get_provider_alerts(current_user)
        elif scope == 'responded':
            alerts = Alert.get_responded_alerts_for_provider(current_user)
        else:
            alerts = Alert.get_active_alerts_for_provider(current_user)
    else:
        alerts = Alert.get_admin_alerts(current_user)
    return jsonify(alerts)


@alert_api.route('/<int:alert_id>', methods=['GET'])
@login_required
def get_alert(alert_id):
    alert = Alert.get(alert_id)
    if not alert:
        return app_error('Alert not found', 404)
    if current_user.role == 'advcoate' and alert.user.id != current_user.id:
        return app_error('Permission denied', 401)
    # TODO: can non-notified providers can view alert and under what conditions
    return jsonify(marshal_alert(alert, current_user))


@alert_api.route('', methods=['POST'])
@required_access('advocate')
@validate(alert_schema)
def create_alert():
    """
    Create and send an alert. Must be an advocate.
    """
    send_out_alert(r.json)
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
        return app_error('No alert was found.', 404)

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
        need.resolved_at = datetime.utcnow()
        need.save(False)

    alert.save()

    if ('notifyProvidersAllResolved' in request.json and
        request.json['notifyProvidersAllResolved']):
        send_out_alert_closed(alert)

    return '', 200
