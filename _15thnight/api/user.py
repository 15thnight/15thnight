from flask import Blueprint, jsonify, request as r
from flask_login import current_user

from _15thnight.marshal import marshal_user
from _15thnight.models import Service, User
from _15thnight.schema import create_user_schema, update_user_schema
from _15thnight.util import api_error, app_error, required_access, validate


user_api = Blueprint('user_api', __name__)


@user_api.route('', methods=['GET'])
@required_access('admin')
def get_users():
    """
    Get a list of all users.
    """
    return jsonify(map(marshal_user, User.all()))


@user_api.route('/<int:user_id>', methods=['GET'])
@required_access('admin')
def get_user(user_id):
    """
    Gets a user by id.
    """
    return jsonify(marshal_user(User.get(user_id)))


@user_api.route('', methods=['POST'])
@required_access('admin')
@validate(create_user_schema)
def create_user():
    """
    Create an user account.
    """
    if User.get_by_email(r.json['email']):
        return api_error(email=['email address already in use'], code=409)
    user = User(
        name=r.json['name'],
        organization=r.json['organization'],
        email=r.json['email'],
        password=r.json['password'],
        phone_number=r.json['phone_number'],
        role=r.json['role'],
        services=Service.get_by_ids(r.json['services'])
    ).save()
    return jsonify(marshal_user(user))


@user_api.route('/<int:user_id>', methods=['PUT'])
@required_access('admin')
@validate(update_user_schema)
def update_user(user_id):
    """
    Update an user account.
    """
    user = User.get(user_id)
    if not user:
        return app_error('User not found', 404)
    if r.json['role'] == 'provider':
        user.services = Service.get_by_ids(r.json['services'])
    if 'password' in r.json:
        user.set_password(r.json['password'])
    user.update(
        email=r.json['email'],
        name=r.json['name'],
        organization=r.json['organization'],
        phone_number=r.json['phone_number'],
        role=r.json['role']
    )
    return jsonify(marshal_user(user))


@user_api.route('/<int:user_id>', methods=['DELETE'])
@required_access('admin')
def delete_user(user_id):
    """
    Delete an user.
    """
    user = User.get(user_id)
    if not user:
        return app_error('User not found')
    if user.id == current_user.id:
        return app_error('Cannot delete own account')
    user.delete()
    return '', 202
