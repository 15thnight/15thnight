#!/usr/bin/env python
from flask.ext.script import Manager

from app import flaskapp
from app.models import User


manager = Manager(flaskapp)

@manager.command
@manager.option('-e', '--email', help='Email')
@manager.option('-p', '--password', help='Password')
@manager.option('-r', '--role', help='Set role')
def create_user(email, password, role):
    user = User(email, password, '', False, False, False, False, role)
    user.save()

@manager.command
def seed_db():
    User('advocate@test.com', '1234', '5415551234', None, None, None, None, 'advocate').save()
    User('provider@test.com', '1234', '5415551234', True, True, True, True, 'provider').save()
    User('admin@test.com', '1234', '5415551234', None, None, None, None, 'admin').save()

if __name__ == '__main__':
    manager.run() 