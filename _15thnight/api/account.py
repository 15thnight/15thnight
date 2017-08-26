from datetime import datetime, timedelta
from flask import Blueprint, current_app, jsonify, request as r
from flask_login import (
    login_user, login_required, current_user
)

from _15thnight.core import (
    send_password_reset, send_help_message, send_confirm_password_reset
)
from _15thnight.marshal import marshal_current_user
from _15thnight.models import Service, User
from _15thnight.schema import (
    update_profile_schema, change_password_schema, login_schema,
    forgot_password_schema, reset_password_schema, help_schema
)
from _15thnight.util import api_error, form_error, required_access, validate


account_api = Blueprint('account_api', __name__)


@account_api.route('/current_user', methods=['GET'])
def get_current_user():
    return jsonify(marshal_current_user(current_user))


@account_api.route('/login', methods=['POST'])
@validate(login_schema)
def login():
    """
    Authenticate with the application.
    """
    user = User.get_by_email(r.json['email'].lower())
    if user is not None and user.check_password(r.json['password']):
        login_user(user)
        return jsonify(marshal_current_user(user))
    return form_error('Invalid username/password.')


@account_api.route('/forgot-password', methods=['POST'])
@validate(forgot_password_schema)
def forgot_password():
    """
    Send a password reset email.
    """
    user = User.get_by_email(r.json['email'])
    if user:
        send_password_reset(user)
    return '', 200


@account_api.route('/reset-password', methods=['POST'])
@validate(reset_password_schema)
def reset_password():
    """
    Reset a user's password with valid token.
    Will send a password reset notification email to user.
    """
    token_life = abs(current_app.config.get('RESET_TOKEN_LIFE', 24))
    token_expiration_date = datetime.utcnow() - timedelta(hours=token_life)
    user = User.get_by_email(r.json['email'])
    if not user:
        return form_error('Could not find user.')
    if (not user.reset_token or user.reset_token != r.json['token'] or
            user.reset_created_at < token_expiration_date):
        return form_error('Invalid/expired reset token')
    user.set_password(r.json['password'])
    user.update(reset_token=None, reset_created_at=None)
    send_confirm_password_reset(user)
    login_user(user)
    return jsonify(marshal_current_user(user))


@account_api.route('/change-password', methods=['POST'])
@login_required
@validate(change_password_schema)
def change_password():
    """
    Change logged in user's password.
    """
    if not current_user.check_password(r.json['current']):
        return api_error(dict(form=['Current password is incorrect.']))
    current_user.set_password(r.json['new_password'])
    current_user.save()
    return '', 200


@account_api.route('/update-profile', methods=['POST'])
@login_required
@validate(update_profile_schema)
def update_profile():
    """
    Update logged in user's profile.
    """
    if current_user.is_provider:
        current_user.services = Service.get_by_ids(r.json['services'])
    current_user.update(
        name=r.json['name'],
        organization=r.json['organization'],
        email=r.json['email'],
        phone_number=r.json['phone_number']
    )
    return jsonify(marshal_current_user(current_user))


@account_api.route('/help', methods=['POST'])
@required_access('provider')
@validate(help_schema)
def help_message():
    """
    Send a help message on behalf of the provider.
    """
    send_help_message(current_user, r.json['message'])
    return '', 200
