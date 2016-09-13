"""Data Models."""
import uuid
from datetime import datetime, timedelta

from sqlalchemy import (
    Column, DateTime, Enum, ForeignKey, Integer, String, Table, Text, desc
)
from sqlalchemy.orm import backref, relationship
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
            .join(cls.services) \
            .filter(Service.id.in_(services)) \
            .filter(cls.role == 'provider') \
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
    description = Column(String(200), nullable=False)
    gender = Column(Enum(
        'male', 'female', 'unspecified'), nullable=False, default='unspecified'
    )
    age = Column(Integer, nullable=False, default=0)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', backref='alerts')
    needs = relationship(
        "Service", secondary="alert_services", backref="alerts")

    @classmethod
    def get_active_alerts_for_provider(cls, user):
        time_to_filter_from = datetime.now() - timedelta(days=2)
        alerts_past_two_days = cls.query\
            .filter(cls.created_at > time_to_filter_from)\
            .order_by(desc(cls.created_at)) \
            .all()
        responded_alerts = map(
            lambda respond: respond.alert_id,
            Response.query.filter(
                Response.user_id == user.id,
                Response.created_at > time_to_filter_from
            )
        )

        for alert in alerts_past_two_days:
            if alert.id in responded_alerts:
                alerts_past_two_days.remove(alert)

        return alerts_past_two_days

    @classmethod
    def get_user_alerts(cls, user):
        return cls.query.filter(cls.user == user) \
            .order_by(desc(Alert.created_at)).all()

    @classmethod
    def get_user_alert(cls, user, id):
        return cls.query.filter(cls.user == user & cls.id == id).first()

    @classmethod
    def get_alerts(cls):
        return cls.query.order_by(desc(Alert.created_at)).all()

    def get_needs(self):
        needs = []
        for category in self.needs:
            needs.append(category.name)

        return ", ".join(needs)

    def get_user_response(self, user):
        response = Response.get_by_user_and_alert(user, self)
        if response:
            return response
        return False

    def to_json(self):
        # datetime.isoformat does not append +0000 when using UTC, javascript
        # needs it, or the date is parsed as if it were in the local timezone
        ldt = self.created_at.isoformat()
        localeDateTime = ldt if ldt[-6] == "+" else "%s+0000" % ldt

        return dict(
            id=self.id,
            user=self.user,
            created_at=localeDateTime,
            description=self.description,
            gender=self.gender,
            age=self.age,
            needs=self.needs
        )


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
    message = Column(Text, nullable=True, default='')

    @classmethod
    def get_by_user_and_alert(cls, user, alert):
        return cls.query.filter(
            cls.user == user).filter(cls.alert == alert).all()

    def to_json(self):
        # datetime.isoformat does not append +0000 when using UTC, javascript
        # needs it, or the date is parsed as if it were in the local timezone
        ldt = self.created_at.isoformat()
        localeDateTime = ldt if ldt[-6] == "+" else "%s+0000" % ldt

        return dict(
            user=self.user,
            created_at=localeDateTime,
            alert=self.alert,
            message=self.message
        )


user_categories = Table(
    'user_services', Model.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('service_id', Integer, ForeignKey('service.id'))
)

alert_services = Table(
    'alert_services', Model.metadata,
    Column('alert_id', Integer, ForeignKey('alerts.id')),
    Column('service_id', Integer, ForeignKey('service.id'))
)
