"""Data Models."""
import uuid
from datetime import datetime, timedelta

from flask import url_for
from sqlalchemy import (
    Column, DateTime, Enum, ForeignKey, Integer, String, Table, Text, desc,
    Boolean
)
from sqlalchemy.orm import backref, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from _15thnight import marshal
from _15thnight.database import Model
from _15thnight.marshal import marshal_alert


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
    name = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(Text, nullable=False)
    phone_number = Column(String(20), nullable=False)
    role = Column(Enum('admin', 'advocate', 'provider'), default='advocate')
    # Services only apply to providers
    services = relationship("Service",
                            secondary="user_services",
                            backref="providers")
    reset_token = Column(String(255))
    reset_created_at = Column(DateTime)

    def __init__(self, name, organization, email, password, phone_number,
                 services, role):
        self.name = name
        self.organization = organization
        self.email = email.lower()
        self.set_password(password)
        self.phone_number = phone_number
        self.role = role
        self.services = services

    def check_password(self, password):
        """Check a user's password (includes salt)."""
        return check_password_hash(self.password, password)

    def generate_reset_token(self):
        self.reset_token = str(uuid.uuid4())
        self.reset_created_at = datetime.utcnow()

    def get_alerts(self):
        order = desc(self.created_at)
        return self.query.filter(self.user == self).order_by(order).all()

    def get_id(self):
        """Get the User id in unicode or ascii."""
        try:
            return unicode(self.id)
        except NameError:
            return str(self.id)

    def set_password(self, password):
        """Using pbkdf2:sha512, hash 'password'."""
        self.password = generate_password_hash(
            password=password,
            method='pbkdf2:sha512',
            salt_length=128
        )

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_advocate(self):
        return self.role == 'advocate'

    @property
    def is_provider(self):
        return self.role == 'provider'

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

    @classmethod
    def get_users(cls):
        return cls.query.order_by(desc(cls.created_at)).all()

    @classmethod
    def providers_with_services(cls, services):
        """Return a list of users in the passed in services."""
        return cls.query \
            .filter(cls.role == 'provider') \
            .join(cls.services) \
            .filter(Service.id.in_(services)) \
            .distinct() \
            .all()

    @classmethod
    def get_by_email(cls, email):
        """Return user based on email."""
        return cls.query.filter(cls.email == email).first()

    def __repr__(self):
        """Return <User: %(email)."""
        return '<User %s>' % self.email


class Alert(Model):
    """Alert Model for alertering users."""

    __tablename__ = 'alerts'
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    description = Column(String(200), nullable=False)
    gender = Column(Enum('male', 'female', 'unspecified'),
                    nullable=False, default='unspecified')
    age = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    # The advocate who created the alert
    user = relationship('User', backref='alerts')

    @classmethod
    def get_active_alerts_for_provider(cls, provider):
        # TODO: possibly change this to use provider notified?
        two_days_ago = datetime.now() - timedelta(days=2)
        alerts_past_two_days = cls.query \
            .filter(cls.created_at > two_days_ago) \
            .order_by(desc(cls.created_at)) \
            .all()
        capabilities = set(map(lambda service: service.name, provider.services))
        alerts = []

        def need_mapper(need):
            """
            Need is applicable if it's not marked as resolved
            or the provider hasn't responded to it.
            """
            need_count = len(Pledge.get_by_need_and_provider(need, provider))
            if need.resolved or need_count > 0:
                return None
            return need.service_name

        for alert in alerts_past_two_days:
            service_ids = set(map(need_mapper, alert.needs))
            if (len(capabilities.intersection(service_ids)) > 0):
                alerts.append(alert)

        return [marshal_alert(alert, provider) for alert in alerts]

    @classmethod
    def get_admin_alerts(cls, admin):
        return [marshal_alert(alert, admin) for alert in cls.get_alerts()]

    @classmethod
    def get_advocate_alerts(cls, advocate):
        alerts = cls.query \
            .filter(cls.user == advocate) \
            .order_by(desc(Alert.created_at)).all()
        return [marshal_alert(alert, advocate) for alert in alerts]

    @classmethod
    def get_user_alert(cls, user, alert_id):
        return cls.query.filter(
            (cls.user == user) & (cls.id == alert_id)).first()

    @classmethod
    def get_alerts(cls):
        return cls.query.order_by(desc(Alert.created_at)).all()

    @classmethod
    def get_provider_alerts(cls, provider):
        alerts = Alert.query \
            .join(cls.notified) \
            .filter(ProviderNotified.provider_id == provider.id) \
            .order_by(desc(cls.created_at)) \
            .distinct().all()
        return [marshal_alert(alert, provider) for alert in alerts]

    @classmethod
    def get_responded_alerts_for_provider(cls, provider):
        alerts = Alert.query \
            .join(cls.responses) \
            .filter(Response.user_id == provider.id) \
            .order_by(desc(cls.created_at)) \
            .distinct().all()
        return [marshal_alert(alert, provider) for alert in alerts]

    def provider_has_permission(self, provider):
        """Checks if a provider was notified for this alert"""
        return provider.id in [n.provider_id for n in self.notified]

    def notified_needs(self, provider):
        notified = ProviderNotified.query \
            .filter(ProviderNotified.alert == self) \
            .filter(ProviderNotified.provider == provider).first()
        return notified.needs if notified else []

    @property
    def is_closed(self):
        """Check if all needs have been met."""
        return len([need for need in self.needs if not need.resolved]) == 0

    def get_gender(self):
        """
        Return a formatted string with the gender if male/female.
        Blank string if unspecified.
        """
        gender = '' if self.gender == 'unspecified' else self.gender
        return " %s" % gender

    @property
    def url(self):
        """Return this alert object's respond URL."""
        return "%sr/%s" % (url_for('index', _external=True), self.id)

    def __repr__(self):
        return '<Alert(%d) %s %d %s %s>' % (
            self.id, self.created_at, self.age, self.gender, self.description
        )


class ProviderNotified(Model):
    """Record of provider being sent an alert"""
    __tablename__ = 'provider_notified'

    id = Column(Integer, primary_key=True)
    provider_id = Column(ForeignKey('users.id'))
    provider = relationship('User', backref='notified')
    alert_id = Column(ForeignKey('alerts.id'))
    alert = relationship('Alert', backref='notified')
    needs = relationship('Need',
                         secondary='provider_notified_needs',
                         backref='notified')
    created_at = Column(DateTime, default=datetime.utcnow)


class Category(Model):
    """Category/type of provided help representation."""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    sort_order = Column(Integer, nullable=False, default=0)
    services = relationship('Service',
                            backref=backref('category',
                                            cascade="all, delete-orphan",
                                            single_parent=True),
                            single_parent=True,
                            order_by='Service.sort_order')

    @classmethod
    def all(cls):
        return cls.query.order_by(cls.sort_order).all()

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter(cls.name == name).first()


class Service(Model):
    """Service of provider."""
    __tablename__ = 'service'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    category_id = Column(ForeignKey('categories.id'), nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)

    @classmethod
    def get_by_category(cls, category_id):
        return cls.query.filter(cls.category_id == category_id) \
            .order_by(cls.sort_order) \
            .all()

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter(cls.name == name).first()


class Response(Model):
    """A Response model."""

    __tablename__ = 'responses'
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('users.id'))
    user = relationship('User', backref='responses')
    created_at = Column(DateTime, default=datetime.utcnow)
    alert_id = Column(ForeignKey('alerts.id'))
    alert = relationship('Alert', backref='responses')


class Pledge(Model):
    """A pledged need in a response."""

    __tablename__ = 'need_provided'
    id = Column(Integer, primary_key=True)
    alert_id = Column(ForeignKey('alerts.id'))
    alert = relationship('Alert', backref='pledges')
    provider_id = Column(ForeignKey('users.id'))
    provider = relationship('User', backref='pledges')
    need_id = Column(ForeignKey('need.id'))
    need = relationship('Need', backref='pledges')
    response_id = Column(ForeignKey('responses.id'))
    response = relationship('Response', backref='pledges')
    message = Column(Text, nullable=False, default='')
    selected = Column(Boolean)

    @classmethod
    def get_by_need_and_provider(cls, need, provider):
        return cls.query \
            .filter(cls.need == need) \
            .join(cls.response) \
            .filter(Response.user == provider) \
            .all()


class Need(Model):
    __tablename__ = 'need'

    id = Column(Integer, primary_key=True)
    alert_id = Column(ForeignKey('alerts.id'), nullable=False)
    alert = relationship('Alert', backref='needs')
    service_name = Column(String(255))
    service_description = Column(Text)
    category_name = Column(String(255))
    category_description = Column(Text)
    resolved = Column(Boolean, default=False, nullable=False)
    resolved_at = Column(DateTime)
    resolve_notes = Column(Text)
    resolve_message = Column(Text)


# MtM tables
user_categories = Table(
    'user_services', Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), nullable=False),
    Column('service_id', Integer, ForeignKey('service.id'), nullable=False)
)

provider_notified_needs = Table(
    'provider_notified_needs', Model.metadata,
    Column('provider_notified_id', Integer,
           ForeignKey('provider_notified.id'), nullable=False),
    Column('need_id', Integer, ForeignKey('need.id'), nullable=False)
)
