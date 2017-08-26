from flask import Blueprint, jsonify, request as r
from flask_login import login_required

from _15thnight.marshal import marshal_category
from _15thnight.models import Category, Service
from _15thnight.schema import category_schema, category_sort_schema
from _15thnight.util import app_error, required_access, validate

category_api = Blueprint('category_api', __name__)


@category_api.route('', methods=['GET'])
@login_required
def get_categories():
    """
    Gets the list of categories.
    """
    # TODO: pagination
    return jsonify(map(marshal_category, Category.all()))


@category_api.route('/<int:category_id>', methods=['GET'])
@required_access('admin')
def get_category(category_id):
    """
    Gets a category.
    """
    return jsonify(marshal_category(Category.get(category_id)))


@category_api.route('', methods=['POST'])
@required_access('admin')
@validate(category_schema)
def create_category():
    """
    Create a category. Must be an admin.
    """
    category = Category(
        name=r.json['name'],
        description=r.json['description']
    ).save()
    return jsonify(marshal_category(category))


@category_api.route('/<int:category_id>', methods=['PUT'])
@required_access('admin')
@validate(category_schema)
def update_category(category_id):
    """
    Update an category.
    """
    category = Category.get(category_id)
    if not category:
        return app_error('Category not found', 404)
    if (category.name != r.json['name'] and
            Category.get_by_name(r.json['name'])):
        return api_error(name=['name already in use'])

    if 'services' in r.json:
        for idx, service_id in enumerate(r.json['services']):
            service = Service.get(service_id)
            service.update(sort_order=idx, _commit=False)

    category.update(name=r.json['name'], description=r.json['description'])
    return '', 200

@category_api.route('/sort_order', methods=['PUT'])
@required_access('admin')
@validate(category_sort_schema)
def set_category_sort():
    """
    Sets the order of the categories.
    """
    for data in r.json['sorted_ids']:
        category = Category.get(data['id'])
        category.update(sort_order=data['sort_order'],)
        category.save()
    return jsonify(Category.all())


@category_api.route('/<int:category_id>', methods=['DELETE'])
@required_access('admin')
def delete_category(category_id):
    """
    Delete an category.
    """
    category = Category.get(category_id)
    if not category:
        return app_error('Category not found', 404)
    for service in category.services:
        service.delete(False)
    category.delete()
    return '', 200
