"""15th Night Flask App."""

from flask import Flask, json, redirect, render_template, request
from flask_login import LoginManager, current_user, logout_user
from werkzeug.datastructures import MultiDict

from _15thnight import database, queue
from _15thnight.api import (
    account_api, alert_api, category_api, need_api, response_api, service_api,
    user_api
)
from _15thnight.email import mailer
from _15thnight.marshal import marshal_current_user
from _15thnight.models import User
from _15thnight.util import csrf_protect


app = Flask(__name__)

try:
    app.config.from_object('config')
except:
    app.config.from_object('configdist')

app.secret_key = app.config['SECRET_KEY']

app.register_blueprint(alert_api, url_prefix='/api/v1/alert')
app.register_blueprint(account_api, url_prefix='/api/v1/account')
app.register_blueprint(category_api, url_prefix='/api/v1/category')
app.register_blueprint(need_api, url_prefix='/api/v1/need')
app.register_blueprint(response_api, url_prefix='/api/v1/response')
app.register_blueprint(service_api, url_prefix='/api/v1/service')
app.register_blueprint(user_api, url_prefix='/api/v1/user')

queue.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

csrf_protect.init_app(app)

mailer.init_app(app)


@login_manager.user_loader
def load_user(id):
    """User loading needed by Flask-Login."""
    return User.get(int(id))


@app.teardown_appcontext
def shutdown_session(response):
    """Database management."""
    database.db_session.remove()


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
    state = json.dumps(dict(current_user=marshal_current_user(current_user)))
    return render_template('index.html', state=state)


@app.route('/logout')
def logout():
    logout_user()
    return redirect('/')


@app.route('/health')
def healthcheck():
    """Low overhead health check."""
    return 'ok', 200
