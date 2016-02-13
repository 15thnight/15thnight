"""Test data tables."""

from sqlalchemy import (
    Column, DateTime, Integer, String, Boolean, Text, ForeignKey, or_, desc
)

from . import db, bcrypt


class User(db.Model):
    """Basic user model."""

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(20), nullable=False)

    def __init__(self, email, password):
        """Initialize the user with a required email address and password."""
        self.email = email
        self.password = bcrypt.generate_password_hash(password)

    def __repr__(self):
        """Return <%(email)."""
        return '<{}>'.format(self.email)

    @property
    def is_authenticated(self):
        """Athentication check."""
        return True

    @property
    def is_active(self):
        """Active check."""
        return True

    @property
    def is_anonymous(self):
        """Anonimity check."""
        return True

    @property
    def get_id(self):
        """User ID getter."""
        return str(self.id)
