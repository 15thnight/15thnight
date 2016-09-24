from flask import current_app, request
from flask.json import dumps, JSONEncoder
from flask.ext.login import current_user
from functools import wraps


class ExtensibleJSONEncoder(JSONEncoder):
    """A JSON encoder that returns the to_json method if present"""
    def default(self, obj):
        if hasattr(obj, 'to_json'):
            return obj.to_json()
        return super(ExtensibleJSONEncoder, self).default(obj)

def extend(dict1, dict2):
    dict1.update(dict2)
    return dict1

def jsonify(*args, **kwargs):
    """Returns a json response"""
    data = None
    indent = not request.is_xhr
    status = kwargs.pop('_status_code', 200)
    if args:
        data = args[0] if len(args) == 1 else args
    if kwargs:
        if data:
            if type(data) != list:
                data = [data]
            data.append(dict(**kwargs))
        else:
            data = dict(**kwargs)
    return current_app.response_class(
        dumps(data, indent=indent), status=status, mimetype='application/json'
    )


def api_error(message='Bad Request', code=400):
    return jsonify(error=message, _status_code=code)


def required_access(*roles):
    def templated(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if current_user.is_anonymous or current_user.role not in roles:
                return 'Access Denied.', 403
            return f(*args, **kwargs)
        return decorated
    return templated


def to_local_datetime(dt):
    """
    datetime.isoformat does not append +0000 when using UTC, javascript
    needs it, or the date is parsed as if it were in the local timezone
    """
    if not dt:
        return None
    ldt = dt.isoformat()
    return ldt if ldt[-6] == "+" else "%s+0000" % ldt