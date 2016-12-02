from flask_testing import LiveServerTestCase, TestCase

from _15thnight import create_app as ran_create_app
from _15thnight.database import Model


class Config(object):
    TESTING = True
    DEBUG = True
    DATABASE_URI = "sqlite://"
    CELERY_BROKER = "sqla+sqlite://"


class RANTestBase(TestCase):
    """Test cases for core.py methods."""

    def create_app(self, more_cfg=dict()):
        app = ran_create_app(Config)
        Model.metadata.create_all(bind=app.db_session.get_bind())
        return app


class RANLiveServerTestBase(RANTestBase, LiveServerTestCase):
    """
    RANTestBase class specifically for running the app/server.

    Will be heavily utilized by Selenium tests.
    """
