from cerberus import Validator
from flask import request, jsonify
from flask_login import current_user
from flask_wtf.csrf import CSRFProtect
from functools import wraps


csrf_protect = CSRFProtect()

def bad_input(error, code=400):
    response = jsonify(error)
    response.status_code = code
    return response

api_error = lambda code=400, **error: bad_input(error, code)

form_error = lambda error: bad_input(dict(form=[error]))

app_error = lambda error, code=400: bad_input(dict(app=[error]), code)

def required_access(*roles):
    def templated(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if current_user.is_anonymous or current_user.role not in roles:
                return app_error('Access Denied', 403)
            return f(*args, **kwargs)
        return decorated
    return templated


def validate(schema):
    def templated(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            v = Validator(schema(**kwargs) if callable(schema) else schema)
            result = v.validate(request.json)
            return f(*args, **kwargs) if result else api_error(**v.errors)
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

re_validator = lambda ex, msg: lambda f, v, e: e if ex.match(v) else e(f, msg)

string = lambda **kwargs: dict(kwargs, type='string')
integer = lambda **kwargs: dict(kwargs, type='integer')
_list = lambda **kwargs: dict(kwargs, type='list')
_dict = lambda **kwargs: dict(kwargs, type='dict')
