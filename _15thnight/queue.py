from celery import Celery
from flask import current_app
from flask_mail import Message

from _15thnight.email import mailer
from _15thnight.twilio_client import send_sms


def init_app(app):
    celery = Celery('15thnight', broker=app.config.get("CELERY_BROKER", ""))
    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery


celery = init_app(current_app)


@celery.task
def queue_send_message(email, number, subject, body):
    """
    Celery task to send messages out in sms and email.
    """
    if number:
        send_sms(to_number=number, body=body)
    message = Message(body=body, subject=subject, recipients=[email])
    mailer.send(message)


@celery.task
def queue_send_email(message):
    mailer.send(message)
