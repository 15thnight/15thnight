#!/usr/bin/env python
from flask.ext.script import Manager

from app import flaskapp


manager = Manager(flaskapp)


if __name__ == '__main__':
    manager.run() 