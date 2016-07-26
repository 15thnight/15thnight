from celery import Celery
from _15thnight.twilio_client import send_sms

from _15thnight.email_client import send_email

try:
    from config import CELERY_BROKER
except:
    from configdist import CELERY_BROKER 
    

celery = Celery('15thnight', broker=CELERY_BROKER)

def init_app(app):
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask


@celery.task
def queue_send_alert(email, number, body):
    """
    Celery task to send messages out in all forms.
    """
    send_sms(to_number=number, body=body)
    send_email(email, '15th Night Alert', body)