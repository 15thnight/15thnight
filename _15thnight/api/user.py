from flask import Blueprint

from _15thnight.forms import RegisterForm
from _15thnight.models import User
from _15thnight.util import required_access, jsonify, api_error

user_api = Blueprint('user_api', __name__)


@user_api.route('/user', methods=['GET'])
@required_access('admin')
def get_users():
    """
    Get a list of all user accounts.
    """
    return jsonify(User.all())


@user_api.route('/user', methods=['POST'])
@required_access('admin')
def create_user():
    """
    Create an user account.
    """
    form = RegisterForm()
    if not form.validate_on_submit():
        return api_error('Invalid form')
    user = User(
        email=form.email.data,
        password=form.password.data,
        phone_number=form.phone_number.data,
        other=form.other.data,
        shelter=form.shelter.data,
        food=form.food.data,
        clothes=form.clothes.data,
        role=form.role.data
    )
    user.save()
    return jsonify(user)


@user_api.route('/user/<int:id>', methods=['PUT'])
@required_access('admin')
def update_user(id):
    """
    Update an user account.
    """
    form = RegisterForm()
    if not form.validate_on_submit():
        return api_error('Invalid form')
    user = User.get(id)
    if not user:
        return api_error('User not found', 404)
    user.email = form.email.data
    user.password = form.password.data
    user.phone_number = form.phone_number.data
    user.other = form.other.data
    user.shelter = form.shelter.data
    user.food = form.food.data
    user.clothes = form.clothes.data
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
    user.delete()
    return '', 202
