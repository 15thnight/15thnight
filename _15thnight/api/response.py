from flask import Blueprint, request
from flask.ext.login import current_user

from _15thnight.core import respond_to_alert
from _15thnight.models import Alert, Response
from _15thnight.util import required_access, jsonify, api_error

response_api = Blueprint('response_api', __name__)


@response_api.route('/', methods=['GET'])
@required_access('provider')
def get_responses():
    """
    Get a list of a provider's responses.
    """
    return jsonify(Response.get_by_user(current_user))


@response_api.route('/', methods=['POST'])
@required_access('provider')
def create_response():
    """
    Create a response to an alert.

    POST params:
        - alert_id: alert identifier
        - message: response message
    """
    if 'alert_id' not in request.json or 'needs_provided' not in request.json:
        return api_error('Invalid form')

    alert = Alert.get(int(request.json['alert_id']))

    if not alert:
        return api_error('Alert not found.', 404)

    respond_to_alert(current_user, request.json['needs_provided'], alert)

    return '', 201


@response_api.route('/<uuid>', methods=['PUT'])
@required_access('provider', 'admin')
def update_response():
    """
    Update a response to an alert.
    """
    return 'Not Implemented', 501


@response_api.route('/<uuid>', methods=['DELETE'])
@required_access('provider', 'admin')
def delete_response(uuid):
    """
    Delete a response to an alert.
    """
    return 'Not Implemented', 501 # We currently don't support a UI for this
    alert = Alert.get(uuid)
    if not alert:
        return api_error('Alert not found.', 404)
    if current_user.role == 'advocate' and alert.user.id != current_user.id:
        return api_error('Forbidden.', 403)

    alert.delete()
    return '', 202
