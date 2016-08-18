from flask import Blueprint, request
from flask.ext.login import login_required

from _15thnight.forms import CategoryForm
from _15thnight.models import Category, Service
from _15thnight.util import required_access, jsonify, api_error

category_api = Blueprint('category_api', __name__)


@category_api.route('/category', methods=['GET'])
@login_required
def get_categories():
    """
    Gets the list of categories.
    """
    # TODO: pagination
    return jsonify(Category.all())


@category_api.route('/category/<int:category_id>', methods=['GET'])
@required_access('admin')
def get_category(category_id):
    """
    Gets a category.
    """
    return jsonify(Category.get(category_id))


@category_api.route('/category', methods=['POST'])
@required_access('admin')
def create_category():
    """
    Create a category. Must be an admin.
    """
    form = CategoryForm()
    if not form.validate_on_submit():
        return api_error(form.errors)

    name = form.name.data
    description = form.description.data

    try:
        new_category = Category(name=name, description=description)
        new_category.save()
        # TODO Check proper response code
        return '', 201
    except Exception, e:
        return api_error('Unable to create Category: %s. %s' % (name, e))


@category_api.route('/category/<int:category_id>', methods=['PUT'])
@required_access('admin')
def update_category(category_id):
    """
    Update an category.
    """
    form = CategoryForm()
    if not form.validate_on_submit():
        return api_error(form.errors)
    category = Category.get(category_id)
    if not category:
        return api_error('Category not found', 404)

    category.name = form.name.data
    category.description = form.description.data

    if 'services' in request.json:
        services = request.json['services']
        for data in services:
            service = Service.get(data['id'])
            service.sort_order = data['sort_order']
            service.save()

    category.save()
    return '', 200

@category_api.route('/category/sort_order', methods=['PUT'])
@required_access('admin')
def set_category_sort():
    """
    Sets the order of the categories.
    """
    if 'categories' not in request.json:
        return api_error('Invalid form.')
    categories = request.json['categories']
    for data in categories:
        category = Category.get(data['id'])
        category.sort_order = data['sort_order']
        category.save()
    return jsonify(Category.all())


@category_api.route('/category/<int:category_id>', methods=['DELETE'])
@required_access('admin')
def delete_category(category_id):
    """
    Delete an category.
    """
    category = Category.get(category_id)
    if not category:
        return api_error('Category not found', 404)
    category.delete()
    return '', 200
