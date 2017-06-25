# Database config
DATABASE_URI = "sqlite://"
# Database URL for Celery
# Unless you are going to use something like rabitmq, leave this alone
CELERY_BROKER = "sqla+%s" % DATABASE_URI

# Enable debugging output for easier bug reporting
DEBUG = False

# Support contact email
SUPPORT_EMAIL = 'itsupport@example.com'

# Server Specific Settings
PREFERRED_URL_SCHEME = "http"
SERVER_NAME = 'localhost:5000'

# Flask secret Key
SECRET_KEY = 'This is not secret you must change it'
# Life is in hours
RESET_TOKEN_LIFE = 24

# Browser to run front end tests with
# Available browsers are:
# - Chrome, Firefox, IE, Opera, or PhantomJS
TEST_BROWSER = "Firefox"

# Third Party Tool/Library Configuration options #
# TWILIO credentials start
TWILIO_ACCOUNT_SID = "AC38135355602040856210245275870"
TWILIO_ACCOUNT_AUTH_TOKEN = "2flnf5tdp7so0lmfdu3d"
TWILIO_FROM_NUMBER = ""
# Config option for using manage.py to test twilio access.
# This should be in the form of 10 digits. (e.g. 2125553456)
TWILIO_TEST_NUMBER = ""
# TWILIO credentials end

# Mail Configuration
MAIL_SERVER = 'localhost'
MAIL_PORT = 25
MAIL_USERNAME = None
# Even if there is no MAIL_USERNAME, MAIL_DEFAULT_SENTER must be
# set to a valid email address (that will populate the from header)
MAIL_DEFAULT_SENDER = MAIL_USERNAME
MAIL_PASSWORD = None
MAIL_USE_TLS = False
MAIL_USE_SSL = False
# End Mail Configuration

HEADLESS_BROWSER_PATH = "/usr/bin/fx.sh"
