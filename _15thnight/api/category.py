from flask import Blueprint
from flask.ext.login import login_required

from _15thnight.forms import AddCategoryForm
from _15thnight.models import Category
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


@category_api.route('/category', methods=['POST'])
@required_access('admin')
def create_category():
    """
    Create a category. Must be an admin.
    """
    form = AddCategoryForm()
    if not form.validate_on_submit():
        return api_error('Invalid form.')

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
    return 'Not Implemented', 501


@category_api.route('/category/<int:category_id>', methods=['DELETE'])
@required_access('admin')
def delete_category(category_id):
    """
    Delete an category.
    """
    try:
        category = Category.get(category_id)
        category.delete()
        return '', 200
    except Exception, e:
        api_error("Unable to delete category. %s" % e)
