from datetime import datetime

from flask import Blueprint
from flask.ext.login import current_user

from _15thnight.core import resolve_need
from _15thnight.forms import ResolveNeedForm
from _15thnight.models import Need
from _15thnight.util import api_error, jsonify, required_access

need_api = Blueprint('need_api', __name__)


@need_api.route('/<int:need_id>')
@required_access('advocate', 'admin')
def get_need(need_id):
    need = Need.get(need_id)
    if not need:
        return api_error('Need not found')
    if not current_user.is_admin and current_user.id != need.alert.user_id:
        return api_error('Permission denied')
    return jsonify(need.to_advocate_json())


@need_api.route('/<int:need_id>/resolve', methods=['POST'])
@required_access('advocate', 'admin')
def mark_need_resolved(need_id):
    """
    Resolve a need and close an alert if necessary.
    Send out a message stating the alert was closed as well.
    """
    need = Need.get(need_id)

    # Check validity of need_id
    if not need:
        return api_error('Need not found')
    if not current_user.is_admin and current_user.id != need.alert.user_id:
        return api_error('Permission denied')
    if need.resolved:
        return api_error('Need already resolved!')

    # validate the form
    form = ResolveNeedForm(need=need)
    if not form.validate_on_submit():
        return api_error(form.errors)

    # Update Need with form data, including setting resolved to True.
    need.resolved = True
    need.resolved_at = datetime.utcnow()
    need.resolve_notes = form.notes.data
    need.resolve_message = form.message.data
    for provision in need.provisions:
        provision.selected = provision.id in form.provisions.data
    need.save()

    # Check if alert is resolved, notify those involved
    resolve_need(need)

    return '', 200
