"""15th Night Flask App."""

from flask import Flask, json, redirect, render_template, request
from flask.ext.login import LoginManager, current_user, logout_user
from werkzeug.datastructures import MultiDict

from _15thnight.email import mailer
from _15thnight.forms import csrf_protect
from _15thnight.models import User
from _15thnight.util import ExtensibleJSONEncoder


def create_app(cfg=dict()):
    """
    Setup an app with blueprints, extensions, and other necessary additions.

    cfg_dict: dict
        dictionary to update app.config with, useful for testing.
    """
    # The app
    app = Flask(__name__)
    login_manager = LoginManager()

    # Load configdist for default values
    app.config.from_object('configdist')
    try:
        # Attempt to update values with config.py
        # API docs [0] show that from_object behaves like a dict update
        # [0]: http://flask.pocoo.org/docs/0.11/api/#configuration
        app.config.from_object('config')
    except:
        # Else keep the configdist defaults
        pass

    # Oerride configuration options for testing here
    app.config.from_object(cfg)

    # Additional configuration options (used by testing)
    from _15thnight.database import init_db

    # must use app.db_session or current_app.db_session because of this
    app.db_session = init_db(app.config.get("DATABASE_URI"))
    # app.secret_key is used by Flask-WTF
    app.secret_key = app.config['SECRET_KEY']
    app.json_encoder = ExtensibleJSONEncoder

    # Flask Extension Initializations
    with app.app_context():
        from _15thnight import queue
        queue.init_app(app)
        login_manager.init_app(app)
        login_manager.login_view = 'login'
        csrf_protect.init_app(app)
        mailer.init_app(app)

    # Blueprints
    from _15thnight.api import (
        account_api, alert_api, category_api, need_api, response_api,
        service_api, user_api
    )
    app.register_blueprint(alert_api, url_prefix='/api/v1/alert')
    app.register_blueprint(account_api, url_prefix='/api/v1/account')
    app.register_blueprint(category_api, url_prefix='/api/v1/category')
    app.register_blueprint(need_api, url_prefix='/api/v1/need')
    app.register_blueprint(response_api, url_prefix='/api/v1/response')
    app.register_blueprint(service_api, url_prefix='/api/v1/service')
    app.register_blueprint(user_api, url_prefix='/api/v1/user')

    @login_manager.user_loader
    def load_user(id):
        """User loading needed by Flask-Login."""
        return User.get(int(id))

    @app.teardown_appcontext
    def shutdown_session(response):
        """Database management."""
        app.db_session.remove()

    @app.before_request
    def before_request():
        json_multidict = MultiDict(request.json) if request.json else None
        setattr(request, 'json_multidict', json_multidict)

    @app.after_request
    def after_request(response):
        response.headers['Cache-Control'] = (
            'no-store, no-cache, must-revalidate, '
            'post-check=0, pre-check=0, max-age=0'
        )
        response.headers['Expires'] = '-1'
        return response

    @app.route('/')
    @app.route('/<path:path>')
    def index(path=None):
        """Serve the index"""
        state = json.dumps(dict(
            current_user=(
                current_user if current_user.is_authenticated else None)
        ))
        return render_template('index.html', state=state)

    @app.route('/logout')
    def logout():
        logout_user()
        return redirect('/')

    return app

app = create_app()
