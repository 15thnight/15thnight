from datetime import datetime
from flask import Blueprint
from flask.ext.login import current_user

from _15thnight.core import send_out_resolution
from _15thnight.forms import ResolveNeedForm
from _15thnight.models import Need
from _15thnight.util import api_error, jsonify, required_access

need_api = Blueprint('need_api', __name__)


@need_api.route('/need/<int:need_id>')
@required_access('advocate')
def get_need(need_id):
    need = Need.get(need_id)
    if not need:
        return api_error('Need not found')
    if current_user.id != need.alert.user_id:
        return api_error('Permission denied')
    return jsonify(need.to_advocate_json())


@need_api.route('/need/<int:need_id>/resolve', methods=['POST'])
@required_access('advocate')
def resolve_need(need_id):
    need = Need.get(need_id)
    if not need:
        return api_error('Need not found')
    if current_user.id != need.alert.user_id:
        return api_error('Permission denied')
    if need.resolved:
        return api_error('Need already resolved!')
    form = ResolveNeedForm(need=need)
    if not form.validate_on_submit():
        return api_error(form.errors)
    need.resolved = True
    need.resolved_at = datetime.utcnow()
    need.resolve_notes = form.notes.data
    need.resolve_message = form.message.data
    for provision in need.provisions:
        provision.selected = provision.id in form.provisions.data
    send_out_resolution(need)
    need.save()
    return '', 200