from flask import Blueprint, request
from flask.ext.login import login_required

from _15thnight.forms import ServiceForm
from _15thnight.models import Service, Category
from _15thnight.util import required_access, jsonify, api_error

service_api = Blueprint('service_api', __name__)


@service_api.route('/', methods=['GET'])
@login_required
def get_services():
    """
    Gets the list of services.
    """
    # TODO: pagination
    return jsonify(Service.all())


@service_api.route('/<int:service_id>', methods=['GET'])
@required_access('admin')
def get_service(service_id):
    """
    Gets a service.
    """
    return jsonify(Service.get(service_id))


@service_api.route('/', methods=['POST'])
@required_access('admin')
def create_service():
    """
    Create a service. Must be an admin.
    """
    form = ServiceForm()
    if not form.validate_on_submit():
        return api_error(form.errors)

    service = Service(
        name=form.name.data,
        description=form.description.data,
        category=Category.get(form.category.data)
    )
    service.save()
    return '', 201


@service_api.route('/<int:service_id>', methods=['PUT'])
@required_access('admin')
def update_service(service_id):
    """
    Update an service.
    """
    service = Service.get(service_id)
    if not service:
        return api_error('Service not found', 404)
    form = ServiceForm(
        validate_unique_name=service.name != request.json.get('name')
    )
    if not form.validate_on_submit():
        return api_error(form.errors)

    service.name = form.name.data
    service.description = form.description.data
    service.category = Category.get(form.category.data)

    service.save()
    return '', 200


@service_api.route('/<int:service_id>', methods=['DELETE'])
@required_access('admin')
def delete_service(service_id):
    """
    Delete an service.
    """
    service = Service.get(service_id)
    if not service:
        return api_error('Service not found', 404)
    service.delete()
    return '', 200
