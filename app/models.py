"""
Data Models
"""
from datetime import datetime

from sqlalchemy import (
    Column, DateTime, Integer, String, Boolean, Text, ForeignKey
)
from sqlalchemy.orm import relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.database import Model


class User(Model):
    """
    User Model.

    Required parameters:
        - email, password, phone_number
    """

    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated = Column(DateTime, default=datetime.utcnow)
    email = Column(String(255), nullable=False)
    password = Column(Text, nullable=False)
    phone_number = Column(String(20), nullable=False)
    shelter = Column(Boolean, nullable=False, default=False)
    clothes = Column(Boolean, nullable=False, default=False)
    food = Column(Boolean, nullable=False, default=False)
    other = Column(Text, nullable=False, default='')
    alerts = relationship("Alert", backref='user', lazy='dynamic')

    def __init__(self, email, password, phone_number, other, food, clothes, shelter):
        self.email = email
        self.set_password(password)
        self.phone_number = phone_number
        self.other = other
        self.shelter = shelter
        self.clothes = clothes
        self.food = food

    def check_password(self, password):
        """Check a user's password (includes salt)"""
        return check_password_hash(self.password, password)

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

    def set_password(self, password):
        self.password = generate_password_hash(password=password,
                                               method='pbkdf2:sha512',
                                               salt_length=128)

    def __repr__(self):
        return '<User %r>' % (self.id)


class Alert(Model):
    """
    Alert Model for alertering users.
    """

    __tablename__ = 'alerts'
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    description = Column(String(200), nullable=False)
    shelter = Column(Boolean, nullable=False, default=False)
    clothes = Column(Boolean, nullable=False, default=False)
    food = Column(Boolean, nullable=False, default=False)
    other = Column(Text, nullable=False, default='')
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
