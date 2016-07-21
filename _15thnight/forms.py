from flask_wtf import Form
from wtforms import (
    TextField, PasswordField, TextAreaField, SelectField, SelectMultipleField,
    IntegerField
)
from wtforms.validators import (
    DataRequired, Email, EqualTo, Length, NumberRange
)

from _15thnight.models import Category


USER_ROLES = [
    ('provider', 'PROVIDER'), ('advocate', 'ADVOCATE'), ('admin', 'ADMIN')]


GENDERS = [
    ('male', 'Male'), ('female', 'Female'), ('unspecified', 'Unspecified')]


class RegisterForm(Form):
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
    role = SelectField('User Role', choices=USER_ROLES)
    categories = SelectMultipleField(
        "Categories",
        choices=[],
        coerce=int
    )

    def __init__(self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)
        self.categories.choices = [
            (category.id, category.name) for category in Category.all()]


class AddCategoryForm(Form):
    name = TextField('Name', validators=[DataRequired()])
    description = TextAreaField('Description')


class DeleteUserForm(Form):
    id = IntegerField('id')


class LoginForm(Form):
    email = TextField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])


class AlertForm(Form):
    description = TextAreaField('Description', validators=[DataRequired()])
    gender = SelectField('Gender', choices=GENDERS)
    age = IntegerField('Age', validators=[NumberRange(min=0, max=21)])
    categories = SelectMultipleField(
        "Categories",
        choices=[],
        coerce=int
    )

    def __init__(self, *args, **kwargs):
        super(AlertForm, self).__init__(*args, **kwargs)
        self.categories.choices = [
            (category.id, category.name) for category in Category.all()]


class ResponseForm(Form):
    message = TextAreaField('Message', validators=[DataRequired()])
