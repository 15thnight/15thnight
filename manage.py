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
def seed_db():
    # Seed some categories
    food = Category("Food", "").save()
    shelter = Category("Shelter", "Housing for a limited time.").save()
    clothing = Category("Clothing", "Shirts, shoes, and all things.").save()
    other = Category("Other", "Other help that doesn't fit elsewhere").save()

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


if __name__ == '__main__':
    manager.run()
