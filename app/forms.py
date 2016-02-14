from flask_wtf import Form
from wtforms import TextField, PasswordField, BooleanField, SubmitField, TextAreaField, \
    SelectField, IntegerField
from wtforms.validators import DataRequired, Length, Email, EqualTo, Required



USER_ROLES = [('provider', 'PROVIDER'), ('advocate', 'ADVOCATE'), ('admin', 'ADMIN')]

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
        validators=[DataRequired(), EqualTo('password', message='Passwords muct match.')]
        )
    role = SelectField('User Role', choices=USER_ROLES)
    clothes = BooleanField('Clothes')
    shelter = BooleanField('Shelter')
    food = BooleanField('Food')
    other = BooleanField('Other')

class DeleteUserForm(Form):
    id = IntegerField('id')

class LoginForm(Form):
    email = TextField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

GENDERS = [('male', 'Male'), ('female', 'Female'), ('unspecified', 'Unspecified')]

class AlertForm(Form):
    description = TextAreaField('Description', validators=[DataRequired()])
    shelter = BooleanField('Shelter')
    food = BooleanField('Food')
    clothes = BooleanField('Clothes')
    other = BooleanField('Other')
    gender = SelectField('Gender', choices=GENDERS)
    age = IntegerField('Age')

class ResponseForm(Form):
    message = TextAreaField('Message', validators=[DataRequired()])