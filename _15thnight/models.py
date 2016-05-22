"""Data Models."""
from datetime import datetime, timedelta

from sqlalchemy import (
    Column, DateTime, Integer, String, Boolean, Text, ForeignKey, Enum, desc
)
from sqlalchemy.orm import relationship
from werkzeug.security import check_password_hash, generate_password_hash

from _15thnight.database import Model


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

    def provider_capabilities(self):
        if self.role != 'provider':
            return 'N/A'
        capabilities = ''
        if self.shelter:
            capabilities += 'shelter, '
        if self.clothes:
            capabilities += 'clothes, '
        if self.food:
            capabilities += 'food, '
        if self.other:
            capabilities += 'other, '
        return capabilities[:-2]


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
    def get_users(cls):
        return cls.query.order_by(desc(cls.created_at)).all()

    def get_alerts(self):
        return Alert.query.filter(Alert.user == self).order_by(desc(Alert.created_at)).all()

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


    @classmethod
    def get_active_alerts_for_provider(cls, user):
        time_to_filter_from = datetime.now() - timedelta(days=2)
        active_alerts = []
        alerts_past_two_days = cls.query\
            .filter(cls.created_at > time_to_filter_from)\
            .order_by(desc(cls.created_at)) \
            .all()
        responded_alerts = map(lambda respond: respond.alert_id, Response.query.filter(
                Response.user_id == user.id,
                Response.created_at > time_to_filter_from
        ))

        for alert in alerts_past_two_days:
            if alert.id in responded_alerts:
                alerts_past_two_days.remove(alert)

        for alert in alerts_past_two_days:
            if (alert.food and user.food == alert.food) or \
                    (alert.shelter and user.shelter == alert.shelter) or \
                    (alert.clothes and user.clothes == alert.clothes) or \
                    (alert.other and user.other == alert.other):
                active_alerts.append(alert)

        return active_alerts

    @classmethod
    def get_alerts(cls):
        return cls.query.order_by(desc(Alert.created_at)).all()

    def get_user_response(self, user):
        response = Response.get_by_user_and_alert(user, self)
        if response:
            return response
        return False


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

    @classmethod
    def get_by_user_and_alert(cls, user, alert):
        return cls.query.filter(cls.user == user).filter(cls.alert == alert).all()
