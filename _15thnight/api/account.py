from flask import Blueprint, request, session
from flask.ext.login import (
    login_user, logout_user, login_required, current_user
)
from werkzeug.datastructures import MultiDict

from _15thnight.forms import (
    LoginForm, ChangePasswordForm, UpdateProfileForm, csrf_protect
)
from _15thnight.models import Category, User
from _15thnight.util import jsonify, api_error

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


@account_api.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Send a password reset email.
    """
    # TODO
    return 'Not Implemented', 501


@account_api.route('/change-password', methods=['POST'])
@login_required
def change_password():
    form = ChangePasswordForm(request.json_multidict)
    if not form.validate_on_submit():
        return api_error(form.errors)
    if not current_user.check_password(form.current.data):
        return api_error(dict(form=['Current password is incorrect.']))
    current_user.set_password(form.new_password.data)
    current_user.save()
    return '', 200


@account_api.route('/update-profile', methods=['POST'])
@login_required
def update_profile():
    form = UpdateProfileForm(request.json_multidict)
    if not form.validate_on_submit():
        return api_error(form.errors)
    current_user.email = form.email.data
    current_user.phone_number = form.phone_number.data
    if current_user.is_provider:
        current_user.categories = Category.get_by_ids(form.categories.data)
    current_user.save()
    return jsonify(current_user)
