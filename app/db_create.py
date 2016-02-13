"""Initialize/Create the 15th Night database."""
from . import db

db.create_all()

db.session.commit()
