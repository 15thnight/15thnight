from flask import Blueprint, request, session
from flask.ext.login import login_user

from _15thnight.forms import LoginForm
from _15thnight.models import User
from _15thnight.util import jsonify

account_api = Blueprint('account_api', __name__)


@account_api.route('/login', methods=['POST'])
def login():
    """
    Authenticate with the application.
    """
    # TODO: issue API key here instead of cookie
    form = LoginForm(request.form)
    if form.validate_on_submit():
        user = User.get_by_email(request.form['email'].lower())
        password = request.form.get('password')
        if user is not None and user.check_password(password):
            session['logged_in'] = True
            login_user(user)
            return '', 200
        return jsonify(error='Invalid username/password.', _status_code=401)
    return jsonify(error='Invalid form data', _status_code=400)


@account_api.route('/logout', methods=['POST'])
def logout():
    """
    Deauthenticate with the application.
    """
    # TODO: de-auth API key
    session.clear()
    return '', 200


@account_api.route('/reset_password', methods=['POST'])
def reset_password():
    """
    Send a password reset email.
    """
    # TODO
    return 'Not Implemented', 501
