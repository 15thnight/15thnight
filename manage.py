#!/usr/bin/env python
from flask.ext.script import Manager

from _15thnight import app
from _15thnight.database import Model, engine
from _15thnight.models import Category, User


manager = Manager(app)


@manager.command
@manager.option('-e', '--email', help='Email')
@manager.option('-p', '--password', help='Password')
@manager.option('-r', '--role', help='Set role')
def create_user(email, password, role):
    user = User(email, password, '', False, False, False, False, role)
    user.save()


@manager.command
def create_db():
    Model.metadata.create_all(bind=engine)


@manager.command
def seed_categories():
    """Seed some categories."""

    food = Category.get_by_name("Food")
    if not food:
        food = Category("Food", "", 0)
        food.save()
    shelter = Category.get_by_name("Shelter")
    if not shelter:
        shelter = Category("Shelter", "Housing for a limited time.", 0)
        shelter.save()
    clothing = Category.get_by_name("Clothing")
    if not clothing:
        clothing = Category("Clothing", "Shirts, shoes, and all things.", 0)
        clothing.save()
    other = Category.get_by_name("Other")
    if not other:
        other = Category("Other", "Other help that doesn't fit elsewhere", 0)
        other.save()

    return (food, shelter, clothing, other)


@manager.command
def seed_db():
    """Seed the database with categories and users."""
    (food, shelter, clothing, other) = seed_categories()

    # Seed an admin, advocate, and a few providers
    User('advocate@test.com', '1234', '5415551234', [], 'advocate').save()
    User('provider@test.com', '1234', '5415551234',
         [food, shelter, clothing, other], 'provider').save()
    User('provider+other@test.com', '1234', '5415551234',
         [other], 'provider').save()
    User('provider+food@test.com', '1234', '5415551234',
         [food], 'provider').save()
    User('provider+clothes@test.com', '1234', '5415551234',
         [clothing], 'provider').save()
    User('provider+shelter@test.com', '1234', '5415551234',
         [shelter], 'provider').save()
    User('admin@test.com', '1234', '5415551234', [], 'admin').save()


@manager.command
@manager.option(
    '-n', '--number', help='Twillio Test Phone Number (e.g. 2125553456)')
def twillio_test(number=None):
    """Quick sms test to make sure twillio is functioning as expected."""
    from _15thnight.twilio_client import send_sms

    with app.app_context():
        # This default test number will force twillio to fail, but still be
        # a valid api call
        if not number:
            phone_number = app.config.get("TWILIO_TEST_NUMBER", "2125553456")
        else:
            phone_number = number

        send_sms(phone_number, "Are we operational?")


if __name__ == '__main__':
    manager.run()
