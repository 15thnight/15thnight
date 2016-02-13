from sqlalchemy import Column, DateTime, Integer, String, Boolean, Text, \
    ForeignKey, or_, desc

from __init__ import db, bcrypt
"""
test data tables
"""
class User(db.Model):

	__tablename__ = "users"
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(50), nullable=False)
	password = db.Column(db.String(20), nullable=False)

	def __init__(self, email, password):
		self.email = email
		self.password = bcrypt.generate_password_hash(password)

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

	@property
	def get_id(self):
		return str(self.id)

	def __repr__(self):
		return '<User %r>' % (self.name)
