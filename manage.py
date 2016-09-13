#!/usr/bin/env python
from flask.ext.script import Manager

from _15thnight import app
from _15thnight.database import Model, engine
from _15thnight.models import Category, Service, User


manager = Manager(app)


@manager.command
@manager.option('-n', '--name', help='First and/or Last Name')
@manager.option('-o', '--org', help='User\'s organization')
@manager.option('-e', '--email', help='Email')
@manager.option('-c', '--number', help='Phone Number')
@manager.option('-p', '--password', help='Password')
@manager.option('-r', '--role', help='Set role')
def create_user(name, org, email, number, password, role):
    user = User(
        name, org, email, password, number, [], role)
    user.save()


@manager.command
def create_db():
    Model.metadata.create_all(bind=engine)


@manager.command
def seed_services():
    """Seed some categories and services."""

    food = Category.get_by_name("Food")
    if not food:
        food = Category(name="Food", description="").save()
    food_delivery = Service.get_by_name("Delivery")
    if not food_delivery:
        food_delivery = Service(
            name="Delivery", description="Quick for those hungry children",
            category=food
        ).save()

    shelter = Category.get_by_name("Shelter")
    if not shelter:
        shelter = Category(
            name="Shelter", description="Housing for a limited time.").save()
    shelter_one_night = Service.get_by_name("One night")
    if not shelter_one_night:
        shelter_one_night = Service(
            name="One night", description="A bed for the night",
            category=shelter
        ).save()

    clothing = Category.get_by_name("Clothing")
    if not clothing:
        clothing = Category(
            name="Clothing", description="Shirts, shoes, and all things."
        ).save()
    clothing_young = Service.get_by_name("0-5 clothing")
    if not clothing_young:
        clothing_young = Service(
            name="0-5 clothing",
            description="Clothing for chidren ages 0 to 5",
            category=clothing
        ).save()

    return (food_delivery, shelter_one_night, clothing_young)


@manager.command
def seed_db():
    """Seed the database with categories and users."""
    (food, shelter, clothing) = seed_services()

    # Seed an admin, advocate, and a few providers
    if not User.get_by_email("advocate@example.com"):
        User(
            'Advocate Alice', 'Self', 'advocate@example.com', '1234',
            '5415551234', [], 'advocate').save()
    if not User.get_by_email("provider@example.com"):
        User(
            'Provider Bob', 'Space', 'provider@example.com', '1234',
            '5415551234', [food, shelter, clothing], 'provider').save()
    if not User.get_by_email("provider+food@example.com"):
        User(
            'Food Provider', 'Food4Youth', 'provider+food@example.com', '1234',
            '5415551234', [food], 'provider').save()
    if not User.get_by_email("provider+clothes@example.com"):
        User(
            'Clothing Provider', 'Clothes4Youth',
            'provider+clothes@example.com', '1234', '5415551234', [clothing],
            'provider').save()
    if not User.get_by_email("provider+shelter@example.com"):
        User(
            'Shelter Provider', 'Shelter4Youth',
            'provider+shelter@example.com', '1234', '5415551234', [shelter],
            'provider').save()
    if not User.get_by_email("admin@example.com"):
        User(
            'Admin', '15th Night', 'admin@example.com', '1234', '5415551234',
            [], 'admin').save()


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
