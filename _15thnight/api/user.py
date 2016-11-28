from flask import Blueprint, request
from flask.ext.login import current_user

from _15thnight.forms import FullUserForm, BaseUserForm
from _15thnight.models import Service, User
from _15thnight.util import required_access, jsonify, api_error

user_api = Blueprint('user_api', __name__)


@user_api.route('/user', methods=['GET'])
@required_access('admin')
def get_users():
    """
    Get a list of all users.
    """
    return jsonify(User.all())


@user_api.route('/user/<int:user_id>', methods=['GET'])
@required_access('admin')
def get_user(user_id):
    """
    Gets a user by id.
    """
    return jsonify(User.get(user_id))


@user_api.route('/user', methods=['POST'])
@required_access('admin')
def create_user():
    """
    Create an user account.
    """
    form = FullUserForm()
    if not form.validate_on_submit():
        return api_error(form.errors)
    services = []
    if form.role.data == 'provider':
        services = Service.get_by_ids(form.services.data)
    user = User(
        name=form.name.data,
        organization=form.organization.data,
        email=form.email.data,
        password=form.password.data,
        phone_number=form.phone_number.data,
        role=form.role.data,
        services=services
    )
    user.save()
    return jsonify(user)


@user_api.route('/user/<int:user_id>', methods=['PUT'])
@required_access('admin')
def update_user(user_id):
    """
    Update an user account.
    """
    user = User.get(user_id)
    if not user:
        return api_error('User not found', 404)
    form_kwargs = dict(
        validate_unique_email=user.email != request.json.get('email')
    )
    if 'password' in request.json:
        form = FullUserForm(**form_kwargs)
    else:
        form = BaseUserForm(**form_kwargs)
    if not form.validate_on_submit():
        return api_error(form.errors)
    services = []
    if form.role.data == 'provider':
        user.services = Service.get_by_ids(form.services.data)
    user.email = form.email.data
    if 'password' in request.json:
        user.set_password(form.password.data)
    user.name = form.name.data
    user.organization = form.organization.data
    user.phone_number = form.phone_number.data
    user.role = form.role.data
    user.save()
    return jsonify(user)


@user_api.route('/user/<int:id>', methods=['DELETE'])
@required_access('admin')
def delete_user(id):
    """
    Delete an user.
    """
    user = User.get(id)
    if not user:
        return api_error('User not found', 404)
    if user.id == current_user.id:
        return api_error('Cannot delete self', 404)
    user.delete()
    return '', 202
