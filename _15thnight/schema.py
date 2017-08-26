import re

from flask_login import current_user

from _15thnight.models import User
from _15thnight.util import re_validator, string, integer, _list, _dict



email_format_validator = re_validator(re.compile(r'^.+@([^.@][^@]+)$', re.IGNORECASE),
    'value must be a valid email')

phone_format_validator = re_validator(re.compile(r'^\d{10}$'),
    'value must be a 10 digit phone number')

def email_unique_validator(f, v, e):
    if User.get_by_email(v):
        e(f, 'email already in use')

number_validator = re_validator(re.compile(r'^\d+'), 'value must be a number')

id_list_schema = _list(schema=integer(), minlength=0)

email_schema = string(required=True, maxlength=255,
    validator=email_format_validator)

password_schema = string(required=True, empty=False)

login_schema = dict(email=email_schema, password=password_schema)

forgot_password_schema = dict(email=email_schema)

reset_password_schema = dict(
    email=email_schema,
    password=password_schema,
    token=string(required=True)
)

change_password_schema = dict(current=password_schema, new_password=password_schema)

base_user_schema = dict(
    name=string(required=True, empty=False, maxlength=255),
    organization=string(required=True, empty=False, maxlength=255),
    email=dict(email_schema,
        validator=[email_format_validator, email_unique_validator]),
    phone_number=string(required=True, validator=phone_format_validator),
    services=id_list_schema
)

help_schema = dict(message=string(required=True, empty=False))

alert_schema = dict(
    description=string(required=True, minlength=5, maxlength=200),
    gender=string(required=True, allowed=['male', 'female', 'unspecified']),
    age=string(required=True, validator=number_validator),
    needs=dict(id_list_schema, minlength=1)
)

pledge_schema = dict(
    message=string(required=True, empty=False),
    need_id=integer(required=True)
)

response_schema = dict(
    alert_id=integer(required=True),
    pledges=_list(schema=_dict(schema=pledge_schema))
)

resolve_need_schema = dict(
    notes=string(required=True),
    message=string(required=True),
    pledges=id_list_schema
)

sort_item_schema = dict(
    id=integer(required=True),
    sort_order=integer(required=True)
)

category_service_sort_schema = _list(
    required=True,
    allof=_dict(schema=sort_item_schema)
)

category_sort_schema = dict(sorted_ids=category_service_sort_schema)

category_schema = dict(
    name=string(required=True, empty=False, maxlength=255),
    description=string(required=True),
    services=id_list_schema
)

service_schema = dict(
    name=string(required=True, empty=False, maxlength=255),
    description=string(required=True),
    category=integer(required=True)
)

create_user_schema = dict(base_user_schema,
    role=string(required=True, allowed=['provider', 'advocate', 'admin']),
    password=string(empty=False)
)

def update_profile_schema():
    def update_email_validator(f, v, e):
        if v != current_user.email and User.get_by_email(v):
            e(f, 'email already in use')
    email_validators = [update_email_validator, email_format_validator]
    email = dict(email_schema, validator=email_validators)
    return dict(base_user_schema, email=email)

def update_user_schema(user_id):
    def update_email_validator(f, v, e):
        user = User.get_by_email(v)
        if user and user.id != user_id:
            e(f, 'email already in use')
    email_validators = [update_email_validator, email_format_validator]
    email = dict(email_schema, validator=email_validators)
    return dict(create_user_schema, email=email)
