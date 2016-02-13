from sqlalchemy import Column, DateTime, Integer, String, Boolean, Text, \
    ForeignKey, or_, desc

from __init__ import db, bcrypt
from sqlalchemy.orm import relationship
"""
test data tables
"""
class User(db.Model):

	__tablename__ = "users"
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(50), nullable=False)
	password = db.Column(db.String(20), nullable=False)
	phone_number = db.Column(db.String(20), nullable=False)
	shelter = db.Column(db.String(50), nullable=False, default='')
	clothes = db.Column(db.String(50), nullable=False, default='')
	food = db.Column(db.String(50), nullable=False, default='')
	other = db.Column(db.String(50), nullable=False, default='')
	alerts = relationship("Alert", backref='user', lazy='dynamic')
	
	def __init__(self, email, password, phone_number, other, food, clothes, shelter):
		self.email = email
		self.password = bcrypt.generate_password_hash(password)
		self.phone_number = phone_number
		self.other = other
		self.shelter = shelter
		self.clothes = clothes
		self.food = food

	def __repr__(self):

		return '<{}>'.format(self.email)

	@property 
	def is_authenticated(self):
		return True

	@property 
	def is_active(self):
		return True

	@property 
	def is_anonymous(self):
		return True

	def get_id(self):
		try:
			return unicode(self.id)
		except NameError:
			return str(self.id)

	def __repr__(self):
		return '<User %r>' % (self.id)

class Alert(db.Model):

	__tablename__ = 'alerts'
	id = db.Column(db.Integer, primary_key=True)
	description = db.Column(db.String(200), nullable=False)
	shelter = db.Column(db.String(50), nullable=False, default='')
	clothes = db.Column(db.String(50), nullable=False, default='')
	food = db.Column(db.String(50), nullable=False, default='')
	other = db.Column(db.String(50), nullable=False, default='')
	user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=False)