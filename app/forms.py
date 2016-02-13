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

class LoginForm(Form):
	email = TextField('Email', validators=[DataRequired()])
	password = PasswordField('Password', validators=[DataRequired()])
	
class AlertForm(Form):
	description = TextAreaField('Description', validators=[DataRequired()])
	other = BooleanField('other')
	clothes = BooleanField('clothes')
	shelter = BooleanField('shelter')
	food = BooleanField('food')