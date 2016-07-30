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


class BaseUserForm(Form):
    """
    Creates a form that requires an email,
    password, phone number, and checked boxes.

    """
    email = TextField(
        'Email Address',
        validators=[DataRequired(), Email(message=None), Length(min=6, max=40)]
        )
    phone_number = TextField(
        'Phone Number',
        validators=[DataRequired(), Length(min=10)])
    role = SelectField('User Role', choices=USER_ROLES)
    categories = SelectMultipleField(
        "Categories",
        choices=[],
        coerce=int,
    )

    def __init__(self, *args, **kwargs):
        super(BaseUserForm, self).__init__(*args, **kwargs)
        self.categories.choices = [
            (category.id, category.name) for category in Category.all()
        ]

class FullUserForm(BaseUserForm):
    password = PasswordField(
        'Password',
        validators=[DataRequired(), Length(min=2, max=25)]
    )
    confirm = PasswordField(
        'Confirm Password',
        validators=[
            DataRequired(),
            EqualTo('password', message='Passwords muct match.')
        ])

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
    needs = SelectMultipleField(
        "Categories",
        choices=[],
        coerce=int
    )

    def __init__(self, *args, **kwargs):
        super(AlertForm, self).__init__(*args, **kwargs)
        self.needs.choices = [
            (category.id, category.name) for category in Category.all()
        ]


class ResponseForm(Form):
    message = TextAreaField('Message', validators=[DataRequired()])
