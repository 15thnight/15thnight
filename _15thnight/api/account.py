from datetime import datetime, timedelta
from flask import Blueprint, request, render_template, url_for
from flask.ext.login import (
    login_user, logout_user, login_required, current_user
)
from flask_mail import Message

from _15thnight.forms import (
    LoginForm, ChangePasswordForm, UpdateProfileForm, ResetPasswordForm,
    ForgotPasswordForm, csrf_protect
)
from _15thnight.models import Service, User
from _15thnight.queue import queue_send_email
from _15thnight.util import jsonify, api_error

try:
    from config import RESET_TOKEN_LIFE
except:
    from config import RESET_TOKEN_LIFE


account_api = Blueprint('account_api', __name__)

reset_token_life = timedelta(hours=RESET_TOKEN_LIFE)


@account_api.route('/current_user', methods=['GET'])
def get_current_user():
    user = None
    if current_user.is_authenticated:
        user = current_user
    return jsonify(current_user=user)


@account_api.route('/login', methods=['POST'])
def login():
    """
    Authenticate with the application.
    """
    # TODO: issue API key here instead of cookie
    form = LoginForm(request.json_multidict)
    if not form.validate_on_submit():
        return api_error(form.errors)
    user = User.get_by_email(form.email.data.lower())
    password = form.password.data
    if user is not None and user.check_password(password):
        login_user(user)
        return jsonify(user)
    return api_error(dict(form=['Invalid username/password.']))


@account_api.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Deauthenticate with the application.
    """
    # TODO: de-auth API key
    logout_user()
    return jsonify(csrf_token=csrf_protect._get_csrf_token())


@account_api.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Send a password reset email.
    """
    form = ForgotPasswordForm(request.json_multidict)
    if not form.validate_on_submit():
        return api_error(form.errors)
    user = User.get_by_email(form.email.data)
    if user:
        if (not user.reset_token or
                user.reset_created_at < datetime.utcnow() - reset_token_life):
            user.generate_reset_token()
        user.save()
        link = '%sreset-password/%s/%s' % (
            url_for('index', _external=True), user.email, user.reset_token
        )
        message = Message(
            subject='15th Night Password Reset Link',
            body=render_template('email/reset_instructions.txt', link=link),
            html=render_template('email/reset_instructions.html', link=link),
            recipients=[user.email]
        )
        queue_send_email.apply_async(kwargs=dict(message=message))
    return '', 200


@account_api.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Reset a user's password with valid token.
    Will send a password reset notification email to user.
    """
    form = ResetPasswordForm(request.json_multidict)
    if not form.validate_on_submit():
        return api_error(form.errors)
    user = User.get_by_email(form.email.data)
    if not user:
        return api_error(dict(form=['Could not find user.']))
    if not user.reset_token or user.reset_token != form.token.data:
        return api_error(dict(form=['Invalid reset token.']))
    if user.reset_created_at < datetime.utcnow() - reset_token_life:
        return api_error(dict(form=['Reset token expired']))
    user.set_password(form.password.data)
    user.reset_token = None
    user.reset_created_at = None
    user.save()
    data = dict(
        time=datetime.utcnow().strftime('%m/%d/%y %I:%M%p'),
        ip=request.remote_addr
    )
    message = Message(
        subject='15th Night Password was Reset',
        body=render_template('email/reset_notice.txt', **data),
        html=render_template('email/reset_notice.html', **data),
        recipients=[user.email]
    )
    queue_send_email.apply_async(kwargs=dict(message=message))
    login_user(user)
    return jsonify(user)


@account_api.route('/change-password', methods=['POST'])
@login_required
def change_password():
    """
    Change logged in user's password.
    """
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
    """
    Update logged in user's profile.
    """
    form = UpdateProfileForm(request.json_multidict)
    if not form.validate_on_submit():
        return api_error(form.errors)
    current_user.name = form.name.data
    current_user.organization = form.organization.data
    current_user.email = form.email.data
    current_user.phone_number = form.phone_number.data
    if current_user.is_provider:
        current_user.services = Service.get_by_ids(form.services.data)
    current_user.save()
    return jsonify(current_user)
