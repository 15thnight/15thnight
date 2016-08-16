from flask_wtf import Form
from flask_wtf.csrf import CsrfProtect
from wtforms import (
    BooleanField, IntegerField, PasswordField, SelectField,
    SelectMultipleField, TextAreaField, TextField
)
from wtforms.validators import DataRequired, Length, Email, EqualTo, Required

from _15thnight.models import Category


csrf_protect = CsrfProtect()


USER_ROLES = [
    ('provider', 'PROVIDER'), ('advocate', 'ADVOCATE'), ('admin', 'ADMIN')
]

GENDERS = [
    ('male', 'Male'), ('female', 'Female'), ('unspecified', 'Unspecified')
]


user_email_feild = TextField(
    'Email Address',
    validators=[DataRequired(), Email(message=None), Length(min=6, max=40)]
)

user_phone_number_field = TextField(
    'Phone Number',
    validators=[DataRequired(), Length(min=10)]
)

user_password_field = PasswordField(
    'Password',
    validators=[DataRequired(), Length(min=2, max=25)]
)

category_field = SelectMultipleField(
    "Categories",
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
    categories = category_field

    def __init__(self, *args, **kwargs):
        super(BaseUserForm, self).__init__(*args, **kwargs)
        self.categories.choices = [
            (category.id, category.name) for category in Category.all()
        ]


class FullUserForm(BaseUserForm):
    password = user_password_field


class AddCategoryForm(Form):
    name = TextField("Name", validators=[DataRequired()])
    description = TextAreaField("Description")


class LoginForm(Form):
    email = TextField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])


class AlertForm(Form):
    description = TextAreaField('Description', validators=[DataRequired()])
    gender = SelectField('Gender', choices=GENDERS)
    age = IntegerField('Age')
    needs = category_field


class ResponseForm(Form):
    message = TextAreaField('Message', validators=[DataRequired()])


class ChangePasswordForm(Form):
    current = user_password_field
    new_password = user_password_field


class UpdateProfileForm(Form):
    email = user_email_feild
    phone_number = user_phone_number_field
    categories = category_field

    def __init__(self, *args, **kwargs):
        super(UpdateProfileForm, self).__init__(*args, **kwargs)
        self.categories.choices = [
            (category.id, category.name) for category in Category.all()
        ]
