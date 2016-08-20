from flask_wtf import Form
from flask_wtf.csrf import CsrfProtect
from wtforms import (
    IntegerField, PasswordField, SelectField,
    SelectMultipleField, TextAreaField, TextField
)
from wtforms.validators import DataRequired, Email, Length

from _15thnight.models import Category, Service


csrf_protect = CsrfProtect()


USER_ROLES = [
    ('provider', 'PROVIDER'), ('advocate', 'ADVOCATE'), ('admin', 'ADMIN')
]

GENDERS = [
    ('male', 'Male'), ('female', 'Female'), ('unspecified', 'Unspecified')
]


user_email_feild = TextField(
    'Email Address',
    validators=[DataRequired(), Email(message=None), Length(min=6, max=255)]
)

user_phone_number_field = TextField(
    'Phone Number',
    validators=[DataRequired(), Length(min=10)]
)

user_password_field = PasswordField(
    'Password',
    validators=[DataRequired(), Length(min=2, max=25)]
)

service_field = SelectMultipleField(
    "Services",
    choices=[],
    coerce=int,
)


class BaseUserForm(Form):
    """
    Creates a form that requires an email,
    password, phone number, and checked boxes.

    """
    email = user_email_feild
    phone_number = user_phone_number_field
    role = SelectField('User Role', choices=USER_ROLES)
    services = service_field

    def __init__(self, *args, **kwargs):
        super(BaseUserForm, self).__init__(*args, **kwargs)
        self.services.choices = [
            (service.id, service.name) for service in Service.all()
        ]


class FullUserForm(BaseUserForm):
    password = user_password_field


class CategoryForm(Form):
    name = TextField("Name", validators=[DataRequired()])
    description = TextAreaField("Description")


class ServiceForm(Form):
    name = TextField("Name", validators=[DataRequired()])
    description = TextAreaField("Description")
    category = SelectField('Category', coerce=int)

    def __init__(self, *args, **kwargs):
        super(ServiceForm, self).__init__(*args, **kwargs)
        self.category.choices = [
            (category.id, category.name) for category in Category.all()
        ]


class LoginForm(Form):
    email = TextField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])


class AlertForm(Form):
    description = TextAreaField('Description', validators=[DataRequired()])
    gender = SelectField('Gender', choices=GENDERS)
    age = IntegerField('Age')
    needs = service_field

    def __init__(self, *args, **kwargs):
        super(AlertForm, self).__init__(*args, **kwargs)
        self.needs.choices = [
            (service.id, service.name) for service in Service.all()
        ]


class ResponseForm(Form):
    message = TextAreaField('Message', validators=[DataRequired()])


class ForgotPasswordForm(Form):
    email = user_email_feild


class ResetPasswordForm(Form):
    email = TextField('Email', validators=[DataRequired()])
    token = TextField("Token", validators=[DataRequired()])
    password = user_password_field


class ChangePasswordForm(Form):
    current = user_password_field
    new_password = user_password_field


class UpdateProfileForm(Form):
    email = user_email_feild
    phone_number = user_phone_number_field
    services = service_field

    def __init__(self, *args, **kwargs):
        super(UpdateProfileForm, self).__init__(*args, **kwargs)
        self.services.choices = [
            (service.id, service.name) for service in Service.all()
        ]
