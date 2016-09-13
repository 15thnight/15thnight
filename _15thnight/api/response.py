from flask import Blueprint, request
from flask.ext.login import current_user

from _15thnight.core import respond_to_alert, validate_text_response
from _15thnight.models import Alert, Response, User
from _15thnight.twilio_client import authenticate_message
from _15thnight.util import required_access, jsonify, api_error

response_api = Blueprint('response_api', __name__)


@response_api.route('/response', methods=['GET'])
@required_access('provider')
def get_responses():
    """
    Get a list of a provider's responses.
    """
    return jsonify(Response.get_by_user(current_user))


@response_api.route('/response', methods=['POST'])
@required_access('provider')
def create_response():
    """
    Create a response to an alert.

    POST params:
        - alert_id: alert identifier
        - message: response message
    """
    if 'alert_id' not in request.json or 'message' not in request.json:
        return api_error('Invalid form')

    alert = Alert.get(int(request.json['alert_id']))

    if not alert:
        return api_error('Alert not found.', 404)

    respond_to_alert(current_user, request.json['message'], alert)

    return '', 201


@response_api.route('/response/<uuid>', methods=['PUT'])
@required_access('advocate', 'admin')
def update_response():
    """
    Update a response to an alert.
    """
    return 'Not Implemented', 501


@response_api.route('/response/<uuid>', methods=['DELETE'])
@required_access('advocate', 'admin')
def delete_response(uuid):
    """
    Delete a response to an alert.
    """
    alert = Alert.get(uuid)
    if not alert:
        return api_error('Alert not found.', 404)
    if current_user.role == 'advocate' and alert.user.id != current_user.id:
        return api_error('Forbidden.', 403)

    alert.delete()
    return '', 202


@response_api.route('/response/sms', methods=['GET'])
def receive_sms_response():
    """
    Process sms alert response from provider received via twilio.

    Other available parameters passed by twilio:
    - msg_sid = request.args.get("MessageSid")
    - sms_sid = request.args.get("SmsSid")
    - account_sid = request.args.get("AccountSid")
    - messaging_service_sid = reuest.args.get("MessagingServiceSid")
    - to = request.argse.get("To")
    - num_media = request.args.get("NumMedia")
    """
    # Verify message was sent via Twilio rather than trusting the message
    # wasn't hand crafted.
    # WARNING: This is Twilio dependant and will break if providers are changed
    msg_sid = request.args.get("MessageSid")
    if not authenticate_message(msg_sid):
        # Not doing anything as the message isn't seen as authentic by twilio.
        return '', 200

    #  Grab tche users
    responding_number = request.args.get("From")

    #  Remove the initial +1 from the number and keep it at 10 digits
    if responding_number.startswith("+"):
        responding_number = responding_number[2:]
    print("Number is: %s" % responding_number)

    body = request.args.get("Body")
    if body:
        body = body.lower()
    print("Body: %s" % body)

    responding_provider = User.get_by_number(responding_number)
    if not responding_provider:
        print(
            "Random mistext? We don't know this number: %s" %
            responding_number
        )
    else:
        parsed_response = validate_text_response(body)
        alert = Alert.get(parsed_response["alert_id"])
        if alert:
            respond_to_alert(
                responding_provider, parsed_response["message"], alert)
        else:
            print("%s is an invalid Alert ID." % parsed_response["alert_id"])

    # Only Twilio will be hitting this, and I'm betting they don't care which
    # response code is returned. So no matter what, this endpoint will always
    # return a 200
    return '', 200
