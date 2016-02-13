from twilio.rest import TwilioRestClient

try:
    from config import TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN, TWILIO_FROM_NUMBER
except:
    from configdist import TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN, TWILIO_FROM_NUMBER

account_sid = TWILIO_ACCOUNT_SID
auth_token = TWILIO_ACCOUNT_AUTH_TOKEN
from_number = TWILIO_FROM_NUMBER
twilio_client = TwilioRestClient(account_sid, auth_token)

def send_sms(to_number=None, body=None):
    res = twilio_client.messages.create(body=body, to='+1'+to_number, from_=from_number)
    print("twilio response: {}".format(res))
