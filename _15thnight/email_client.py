import boto.ses
try:
    from config import AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, EMAIL_SENDER
except:
    from configdist import AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, EMAIL_SENDER

conn = boto.ses.connect_to_region(
        AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)


def send_email(to=None, subject=None, body=None):
    try:
        conn.send_email(EMAIL_SENDER, subject, body, to)
    except Exception as e:
        print("Error sending email through aws ses {}".format(e))


def verify_email(email=None):
    try:
        conn.verify_email_address(email)
    except Exception as e:
        print("Error validating email through aws ses {}".format(e))
