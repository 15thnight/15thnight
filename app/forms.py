from flask_wtf import Form
from wtforms import TextField, PasswordField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length, Email, EqualTo, Required


class RegisterForm(Form):
	"""
	Creates a form that requires an email, 
	password, phone number, and checked boxes.

	"""
	email = TextField(
		'email',
		validators=[DataRequired(), Email(message=None), Length(min=6, max=40)]
		)
	phone_number = TextField(
		'number',
		validators=[DataRequired(), Length(min=10)])
	password = PasswordField(
        'password',
        validators=[DataRequired(), Length(min=2, max=25)]
    )
	confirm = PasswordField(
		'Repeat password',
		validators=[DataRequired(), EqualTo('password', message='Passwords muct match.')]
		)