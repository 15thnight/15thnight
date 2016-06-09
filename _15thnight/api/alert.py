from flask import Blueprint
from flask.ext.login import (
    login_user, current_user, login_required, LoginManager
)

from _15thnight.forms import AlertForm
from _15thnight.models import Alert, User
from _15thnight.util import required_access, jsonify, api_error

try:
    from config import HOST_NAME
except:
    from configdist import HOST_NAME


alert_api = Blueprint('alert_api', __name__)

@alert_api.route('/alert', methods=['GET'])
@required_access('advocate')
def get_alerts():
    """
    Gets list of an advocate's Alerts.
    """
    # TODO: pagination
    return jsonify(Alert.get_user_alerts(current_user))

@alert_api.route('/alert', methods=['POST'])
@required_access('advocate')
def create_alert():
    """
    Create an alert. Must be an advocate.
    """
    form = AlertForm()
    if not form.validate_on_submit():
        return api_error('Invalid form.')
    
    send_out_alert(form)
    return '', 201

@alert_api.route('/alert/<int:id>', methods=['PUT'])
@required_access('advocate')
def update_alert(id):
    """
    Update an alert.
    """
    return 'Not Implemented', 501

@alert_api.route('/alert/<int:id>', methods=['DELETE'])
@required_access('advocate', 'admin')
def delete_alert(id):
    """
    Delete an alert.
    """
    if current_user.role == 'advocate':
        alert = Alert.get_user_alert(current_user, id)
    else:
        alert = Alert.get(id)
    if not alert:
        return api_error('No alert was found.', 404)
    
    alert.delete()
    return '', 200