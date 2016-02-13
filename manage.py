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


if __name__ == '__main__':
    manager.run() 