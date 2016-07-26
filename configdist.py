# Database config
DATABASE_URL = "sqlite:///test.db"

TWILIO_ACCOUNT_SID = ''
TWILIO_ACCOUNT_AUTH_TOKEN = ''
TWILIO_FROM_NUMBER = ''

AWS_REGION=''
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''
EMAIL_SENDER=''

SECRET_KEY = 'This is not secret you must change it'
HOST_NAME='http://localhost:5000'

CELERY_BROKER = "sqla+%s" % DATABASE_URL
