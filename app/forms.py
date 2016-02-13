from flask_wtf import Form
from wtforms import TextField, PasswordField, BooleanField, SubmitField, TextAreaField, \
	SelectField
from wtforms.validators import DataRequired, Length, Email, EqualTo, Required



USER_ROLES = [('admin', 'ADMIN'), ('advocate', 'ADVOCATE'), ('provider', 'PROVIDER')]

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
	role = SelectField('role', choices=USER_ROLES)
	other = BooleanField('other')
	clothes = BooleanField('clothes')
	shelter = BooleanField('shelter')
	food = BooleanField('food')

class LoginForm(Form):
	email = TextField('Email', validators=[DataRequired()])
	password = PasswordField('Password', validators=[DataRequired()])
	
class AlertForm(Form):
	description = TextAreaField('Description', validators=[DataRequired()])
	other = BooleanField('other')
	clothes = BooleanField('clothes')
	shelter = BooleanField('shelter')
	food = BooleanField('food')