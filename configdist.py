# Database config
DATABASE_URL = "sqlite:///test.db"

TWILIO_ACCOUNT_SID = ''
TWILIO_ACCOUNT_AUTH_TOKEN = ''
TWILIO_FROM_NUMBER = ''

# AWS Deprecated config
AWS_REGION=''
AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''
EMAIL_SENDER=''
# End AWS Deprecated config

MAIL_SERVER = 'locahost'
MAIL_PORT = 25
MAIL_USERNAME = None
MAIL_DEFAULT_SENDER = MAIL_USERNAME
MAIL_PASSWORD = None
MAIL_USE_TLS = False
MAIL_USE_SSL = False

SECRET_KEY = 'This is not secret you must change it'
HOST_NAME='http://localhost:5000'

CELERY_BROKER = "sqla+%s" % DATABASE_URL
DEBUG = True

RESET_TOKEN_LIFE = 24 # hours