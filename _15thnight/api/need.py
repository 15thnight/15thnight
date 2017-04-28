from datetime import datetime

from flask import Blueprint, jsonify, request as r
from flask_login import current_user

from _15thnight.core import resolve_need
from _15thnight.marshal import marshal_need
from _15thnight.models import Need
from _15thnight.schema import resolve_need_schema
from _15thnight.util import api_error, app_error, required_access, validate

need_api = Blueprint('need_api', __name__)


@need_api.route('/<int:need_id>')
@required_access('advocate', 'admin')
def get_need(need_id):
    need = Need.get(need_id)
    if not need:
        return app_error('Need not found', 404)
    if current_user.id != need.alert.user_id and not current_user.is_admin:
        return app_error('Permission denied', 403)
    return jsonify(marshal_need(need, current_user))


@need_api.route('/<int:need_id>/resolve', methods=['POST'])
@required_access('advocate', 'admin')
@validate(resolve_need_schema)
def mark_need_resolved(need_id):
    """
    Resolve a need and close an alert if necessary.
    Send out a message stating the alert was closed as well.
    """
    need = Need.get(need_id)

    # Check validity of need_id
    if not need:
        return app_error('Need not found', 404)
    if current_user.id != need.alert.user_id and not current_user.is_admin:
        return app_error('Permission denied', 403)
    if need.resolved:
        return app_error('Need already resolved!')

    # Update Need, including setting
    for pledge in need.pledges:
        pledge.selected = pledge.id in r.json['pledges']
    need.update(
        resolved=True,
        resolved_at=datetime.utcnow(),
        resolve_notes=r.json['notes'],
        resolve_message=r.json['message']
    )

    # Check if alert is resolved, notify those involved
    resolve_need(need)

    return '', 200
