"""Data Models."""
from datetime import datetime

from sqlalchemy import (
    Column, DateTime, Integer, String, Boolean, Text, ForeignKey, Enum
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
    email = Column(String(255), nullable=False, unique=True)
    password = Column(Text, nullable=False)
    phone_number = Column(String(20), nullable=False)
    shelter = Column(Boolean, nullable=True, default=False)
    clothes = Column(Boolean, nullable=True, default=False)
    food = Column(Boolean, nullable=True, default=False)
    other = Column(Boolean, nullable=True, default=False)
    role = Column(Enum('admin', 'advocate', 'provider'), default='advocate')

    def __init__(self, email, password, phone_number, other, food, clothes, shelter, role):
        self.email = email.lower()
        self.set_password(password)
        self.phone_number = phone_number
        self.other = other
        self.shelter = shelter
        self.clothes = clothes
        self.food = food
        self.role = role

    def check_password(self, password):
        """Check a user's password (includes salt)."""
        return check_password_hash(self.password, password)

    @property
    def is_authenticated(self):
        """Authenticaition check."""
        return True

    @property
    def is_active(self):
        """Active check."""
        return True

    @property
    def is_anonymous(self):
        """Anonimity check."""
        return False

    def get_id(self):
        """Get the User id in unicode or ascii."""
        try:
            return unicode(self.id)
        except NameError:
            return str(self.id)

    @classmethod
    def get_by_email(cls, email):
        """Return user based on email."""
        return cls.query.filter(cls.email == email).first()

    @classmethod
    def get_provider(cls, food, shelter, clothes, other):
        users = cls.query.filter(cls.role == 'provider').all()
        providers = []
        for user in users:
            if (food and user.food == food) or \
               (shelter and user.shelter == shelter) or \
               (clothes and user.clothes == clothes) or \
               (other and user.other == other):
                providers.append(user)
        return providers

    def set_password(self, password):
        """Using pbkdf2:sha512, hash 'password'."""
        self.password = generate_password_hash(
            password=password,
            method='pbkdf2:sha512',
            salt_length=128
        )

    def __repr__(self):
        """Return <User: %(email)."""
        return '<User %s>' % (self.email)


class Alert(Model):
    """Alert Model for alertering users."""

    __tablename__ = 'alerts'
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    description = Column(String(200), nullable=False)
    shelter = Column(Boolean, nullable=False, default=False)
    clothes = Column(Boolean, nullable=False, default=False)
    food = Column(Boolean, nullable=False, default=False)
    other = Column(Boolean, nullable=False, default='')
    gender = Column(Enum('male', 'female', 'unspecified'), nullable=False, default='unspecified')
    age = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', backref='alerts')

    def get_needs(self):
        needs = ''
        if self.shelter:
            needs += 'shelter, '
        if self.clothes:
            needs += 'clothes, '
        if self.food:
            needs += 'food, '
        if self.other:
            needs += 'other, '
        return needs[:-2]


class Response(Model):
    """Response model."""

    __tablename__ = 'responses'
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('users.id'))
    user = relationship('User', backref='responses')
    created_at = Column(DateTime, default=datetime.utcnow)
    alert_id = Column(ForeignKey('alerts.id'))
    alert = relationship('Alert', backref='responses')
    message = Column(Text, nullable=True, default='')
