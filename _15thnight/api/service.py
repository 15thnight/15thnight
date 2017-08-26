from flask import Blueprint, jsonify, request as r
from flask_login import login_required

from _15thnight.marshal import marshal_service
from _15thnight.models import Service, Category
from _15thnight.schema import service_schema
from _15thnight.util import api_error, app_error, required_access, validate

service_api = Blueprint('service_api', __name__)


@service_api.route('', methods=['GET'])
@login_required
def get_services():
    """
    Gets the list of services.
    """
    # TODO: pagination
    return jsonify(map(marshal_service, Service.all()))


@service_api.route('/<int:service_id>', methods=['GET'])
@required_access('admin')
def get_service(service_id):
    """
    Gets a service.
    """
    return jsonify(marshal_service(Service.get(service_id)))


@service_api.route('', methods=['POST'])
@required_access('admin')
@validate(service_schema)
def create_service():
    """
    Create a service. Must be an admin.
    """
    service = Service(
        name=r.json['name'],
        description=r.json['description'],
        category=Category.get(r.json['category'])
    ).save()
    return '', 201


@service_api.route('/<int:service_id>', methods=['PUT'])
@required_access('admin')
@validate(service_schema)
def update_service(service_id):
    """
    Update an service.
    """
    service = Service.get(service_id)
    if not service:
        return app_error('Service not found', 404)
    if service.name != r.json['name'] and Service.get_by_name(r.json['name']):
        return api_error(name=['name already in use'], code=409)

    service.update(
        name=r.json['name'],
        description=r.json['description'],
        category=Category.get(r.json['category'])
    )
    return '', 200


@service_api.route('/<int:service_id>', methods=['DELETE'])
@required_access('admin')
def delete_service(service_id):
    """
    Delete an service.
    """
    service = Service.get(service_id)
    if not service:
        return app_error('Service not found', 404)
    service.delete()
    return '', 200
