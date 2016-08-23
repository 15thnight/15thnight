from celery import Celery
from flask_mail import Message

from _15thnight.email import mailer
from _15thnight.email_client import send_email
from _15thnight.twilio_client import send_sms


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
def queue_send_message(email, number, subject, body):
    """
    Celery task to send messages out in sms and email.
    """
    if number:
        send_sms(to_number=number, body=body)
    #send_email(email, subject, body)
    message = Message(body=body, subject=subject, recipients=[email])
    mailer.send(message)

@celery.task
def queue_send_email(message):
    mailer.send(message)