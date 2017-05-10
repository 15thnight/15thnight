"""Data Models."""
import uuid
from datetime import datetime, timedelta

from flask import url_for
from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey, Integer, String, Table, Text,
    desc
)
from sqlalchemy.orm import backref, relationship
from werkzeug.security import check_password_hash, generate_password_hash

from _15thnight.database import Model
from _15thnight.util import extend, to_local_datetime


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
    services = relationship(
        "Service", secondary="user_services", backref="providers")
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
        return Alert.query.filter(Alert.user == self) \
            .order_by(desc(Alert.created_at)).all()

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

    def to_json(self):
        return dict(
            id=self.id,
            name=self.name,
            organization=self.organization,
            email=self.email,
            role=self.role,
            phone_number=self.phone_number,
            created_at=self.created_at,
            services=[dict(name=s.name, id=s.id) for s in self.services]
        )

    def __repr__(self):
        """Return <User: %(email)."""
        return '<User %s>' % (self.email)


class Alert(Model):
    """Alert Model for alertering users."""

    __tablename__ = 'alerts'
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    description = Column(Text, nullable=False)
    gender = Column(Enum(
        'male', 'female', 'unspecified'), nullable=False, default='unspecified'
    )
    age = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    # The advocate who created the alert
    user = relationship('User', backref='alerts')

    @classmethod
    def get_active_alerts_for_provider(cls, user):
        time_to_filter_from = datetime.now() - timedelta(days=2)
        alerts_past_two_days = cls.query\
            .filter(cls.created_at > time_to_filter_from)\
            .order_by(desc(cls.created_at)) \
            .all()
        capabilities = set(map(lambda service: service.id, user.services))
        alerts = []

        def need_mapper(need):
            """
            Need is applicable it's not marked as resolved
            or the provider hasn't responded to it.
            """
            need_count = len(NeedProvided.get_by_need_and_provider(need, user))
            if need.resolved or need_count > 0:
                return None
            return need.service.id

        for alert in alerts_past_two_days:
            service_ids = set(map(need_mapper, alert.needs))
            if (len(capabilities.intersection(service_ids)) > 0):
                alerts.append(alert)

        return [alert.to_provider_json(user) for alert in alerts]

    @classmethod
    def get_admin_alerts(cls):
        return [alert.to_advocate_json() for alert in cls.get_alerts()]

    @classmethod
    def get_advocate_alerts(cls, advocate):
        alerts = cls.query.filter(cls.user == advocate) \
            .order_by(desc(Alert.created_at)).all()
        return [alert.to_advocate_json() for alert in alerts]

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
            .join(cls.providers_notified) \
            .filter(ProviderNotified.provider_id == provider.id) \
            .order_by(desc(cls.created_at)) \
            .distinct().all()
        return [alert.to_provider_json(provider) for alert in alerts]

    @classmethod
    def get_responded_alerts_for_provider(cls, provider):
        alerts = Alert.query \
            .join(cls.responses) \
            .filter(Response.user_id == provider.id) \
            .order_by(desc(cls.created_at)) \
            .distinct().all()
        return [alert.to_provider_json(provider) for alert in alerts]

    def provider_has_permission(self, provider):
        """Checks if a provider was notified for this alert"""
        provider_ids = map(
            lambda notified: notified.provider_id, self.providers_notified)
        return provider.id in provider_ids

    def get_user_response(self, user):
        response = Response.get_by_user_and_alert(user, self)
        if response:
            return response
        return False

    def to_json(self):
        return dict(
            id=self.id,
            user=self.user,
            created_at=to_local_datetime(self.created_at),
            description=self.description,
            gender=self.gender,
            age=self.age,
            needs=[need for need in self.needs]
        )

    def to_advocate_json(self):
        return extend(self.to_json(), dict(
            responses=self.responses,
            needs=[need.to_advocate_json() for need in self.needs]
        ))

    def to_provider_json(self, provider):
        service_ids = [service.id for service in provider.services]
        return extend(self.to_json(), dict(
            responses=Response.get_by_user_and_alert(provider, self),
            needs=[
                need.to_provider_json(provider) for need in self.needs
                if need.service.id in service_ids
            ]
        ))

    @property
    def is_closed(self):
        """Check if all needs have been met."""
        for need in self.needs:
            if not need.resolved:
                return False
        return True

    def get_gender(self):
        """
        Return a formatted string with the gender if male/female.
        Blank string if unspecified.
        """
        gender = '' if self.gender == 'unspecified' else self.gender
        gender_string = " %s" % gender
        return gender_string

    @property
    def url(self):
        """Return this alert object's respond URL."""
        url = "%sr/%s" % (url_for('index', _external=True), self.id)
        return url

    def need_count(self):
        """Return the number of needs for this alert."""
        return len(self.needs)

    def __repr__(self):
        return '<Alert(%d) %s %d %s %s>' % (
            self.id, self.created_at, self.age, self.gender, self.description
        )


class ProviderNotified(Model):
    """Record of provider being sent an alert"""
    __tablename__ = 'provider_notified'

    id = Column(Integer, primary_key=True)
    provider_id = Column(ForeignKey('users.id'))
    provider = relationship('User', backref='alerts_notified')
    alert_id = Column(ForeignKey('alerts.id'))
    alert = relationship('Alert', backref='providers_notified')
    needs = relationship(
        'Need',
        secondary='provider_notified_needs',
        backref='providers_notified')
    created_at = Column(DateTime, default=datetime.utcnow)


class Category(Model):
    """Category/type of provided help representation."""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    sort_order = Column(Integer, nullable=False, default=0)

    @classmethod
    def all(cls):
        return cls.query.order_by(cls.sort_order).all()

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter(cls.name == name).first()

    def to_json(self):
        return dict(
            id=self.id,
            name=self.name,
            description=self.description,
            services=Service.get_by_category(self.id),
            sort_order=self.sort_order
        )


class Service(Model):
    """Service of provider."""
    __tablename__ = 'service'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    category_id = Column(ForeignKey('categories.id'), nullable=False)
    category = relationship(
        'Category', backref=backref('services', cascade="all, delete-orphan"))
    sort_order = Column(Integer, nullable=False, default=0)

    @classmethod
    def get_by_category(cls, category_id):
        return cls.query.filter(cls.category_id == category_id) \
            .order_by(cls.sort_order) \
            .all()

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter(cls.name == name).first()

    def to_json(self):
        return dict(
            id=self.id,
            name=self.name,
            description=self.description,
            category=dict(
                id=self.category.id,
                name=self.category.name,
                description=self.category.description
            ),
            sort_order=self.sort_order
        )


class Response(Model):
    """Response model."""

    __tablename__ = 'responses'
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('users.id'))
    user = relationship('User', backref='responses')
    created_at = Column(DateTime, default=datetime.utcnow)
    alert_id = Column(ForeignKey('alerts.id'))
    alert = relationship('Alert', backref='responses')

    @classmethod
    def get_by_user_and_alert(cls, user, alert):
        return cls.query.filter(
            (cls.user == user) & (cls.alert == alert)).all()

    def to_json(self):
        return dict(
            user=self.user,
            created_at=to_local_datetime(self.created_at),
            needs_provided=self.needs_provided
        )


class NeedProvided(Model):
    """A need provided in a response."""

    __tablename__ = 'need_provided'
    id = Column(Integer, primary_key=True)
    need_id = Column(ForeignKey('need.id'))
    need = relationship('Need', backref='provisions')
    response_id = Column(ForeignKey('responses.id'))
    response = relationship('Response', backref='needs_provided')
    message = Column(Text, nullable=False, default='')
    selected = Column(Boolean)

    @classmethod
    def get_by_need_and_provider(cls, need, provider):
        return cls.query \
            .filter(cls.need == need) \
            .join(cls.response) \
            .filter(Response.user == provider) \
            .all()

    def to_json(self):
        return dict(
            id=self.id,
            created_at=to_local_datetime(self.response.created_at),
            message=self.message
        )

    def to_advocate_json(self):
        return extend(self.to_json(), dict(
            provider=self.response.user
        ))


class Need(Model):
    __tablename__ = 'need'

    id = Column(Integer, primary_key=True)
    alert_id = Column(ForeignKey('alerts.id'), nullable=False)
    alert = relationship('Alert', backref='needs')
    service_id = Column(ForeignKey('service.id'), nullable=False)
    service = relationship('Service')
    resolved = Column(Boolean, default=False, nullable=False)
    resolved_at = Column(DateTime)
    resolve_notes = Column(Text)
    resolve_message = Column(Text)

    @classmethod
    def get_by_id_and_alert(cls, need_id, alert):
        return cls.query.filter(
            (cls.alert == alert) & (cls.id == need_id)).first()

    def to_json(self):
        return dict(
            id=self.id,
            alert_id=self.alert_id,
            service=self.service,
            resolved=self.resolved,
            resolved_at=to_local_datetime(self.resolved_at)
        )

    def to_advocate_json(self):
        return extend(self.to_json(), dict(
            provisions=[
                provision.to_advocate_json() for provision in self.provisions
            ]
        ))

    def to_provider_json(self, provider):
        return extend(self.to_json(), dict(
            provisions=NeedProvided.get_by_need_and_provider(self, provider)
        ))


# MtM tables
user_categories = Table(
    'user_services', Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), nullable=False),
    Column('service_id', Integer, ForeignKey('service.id'), nullable=False)
)

provider_notified_needs = Table(
    'provider_notified_needs', Model.metadata,
    Column(
        'provider_notified_id', Integer,
        ForeignKey('provider_notified.id'), nullable=False),
    Column('need_id', Integer, ForeignKey('need.id'), nullable=False)
)
