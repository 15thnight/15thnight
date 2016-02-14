"""Send texts and stuff."""

from twilio.rest import TwilioRestClient

try:
    from config import (
        TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN, TWILIO_FROM_NUMBER
    )
except:
    from configdist import (
        TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN, TWILIO_FROM_NUMBER
    )

account_sid = TWILIO_ACCOUNT_SID
auth_token = TWILIO_ACCOUNT_AUTH_TOKEN
from_number = TWILIO_FROM_NUMBER
twilio_client = TwilioRestClient(account_sid, auth_token)


def send_sms(to_number=None, body=None):
    """Sending some texts to some peeps."""
    try:
        twilio_client.messages.create(
            body=body, to='+1'+to_number, from_=from_number
        )
    except Exception as e:
        print("Error sending text through twilio {}".format(e))
