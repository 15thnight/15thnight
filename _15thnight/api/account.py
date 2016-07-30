from flask import Blueprint, request, session
from flask.ext.login import login_user, logout_user, login_required
from werkzeug.datastructures import MultiDict

from _15thnight.forms import LoginForm, csrf_protect
from _15thnight.models import User
from _15thnight.util import jsonify

account_api = Blueprint('account_api', __name__)


@account_api.route('/login', methods=['POST'])
def login():
    """
    Authenticate with the application.
    """
    # TODO: issue API key here instead of cookie
    form = LoginForm(request.json_multidict)
    if form.validate_on_submit():
        user = User.get_by_email(form.email.data.lower())
        password = form.password.data
        if user is not None and user.check_password(password):
            login_user(user)
            return jsonify(user)
        return jsonify(error='Invalid username/password.', _status_code=401)
    return jsonify(error='Invalid form data', _status_code=400)


@account_api.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Deauthenticate with the application.
    """
    # TODO: de-auth API key
    logout_user()
    return jsonify(csrf_token=csrf_protect._get_csrf_token())


@account_api.route('/reset_password', methods=['POST'])
def reset_password():
    """
    Send a password reset email.
    """
    # TODO
    return 'Not Implemented', 501
