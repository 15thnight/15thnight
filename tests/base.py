from flask_testing import LiveServerTestCase, TestCase

from _15thnight import create_app as ran_create_app


class RANTestBase(TestCase):
    """Test cases for core.py methods."""

    def create_app(self, more_cfg=dict()):
        cfg = dict({
            "TESTING": True,
            "DEBUG": True,
            "DATABASE_URI": "sqlite:///tmp.sql",
            "BROKER_URI": "sqla+sqlite:///tmp.sql"
        })
        cfg.update(more_cfg)
        app = ran_create_app(cfg)
        return app


class RANLiveServerTestBase(RANTestBase, LiveServerTestCase):
    """
    RANTestBase class specifically for running the app/server.

    Will be heavily utilized by Selenium tests.
    """

    def create_app(self):
        cfg_opts = dict({
            "LIVESERVER_PORT": 8081,
            "LIVESERVER_TIMEOUT": 120,
        })
        app = super(RANLiveServerTestBase, self).create_app(cfg_opts)
        return app
