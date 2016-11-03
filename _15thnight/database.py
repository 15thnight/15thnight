from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base


class BaseModel(object):
    """Base class for all database models"""

    @classmethod
    def all(cls):
        return cls.query.all()

    @classmethod
    def get(self, id):
        """Get a model by it's PK"""
        return self.query.filter(self.id == id).first()

    @classmethod
    def get_by_ids(cls, id_list):
        if len(id_list) == 0:
            return []
        return cls.query.filter(cls.id.in_(id_list)).all()

    def save(self, commit=True):
        """Creates or updates a model in the database"""
        self.db_session.add(self)
        if commit:
            self.db_session.commit()

    def delete(self, commit=True):
        """Removes a model from the database"""
        self.db_session.delete(self)
        if commit:
            self.db_session.commit()

# Create declarative base Model for database objects
Model = declarative_base(name="Model", cls=BaseModel)


def init_db(db_uri):
    # Create database engine
    engine = create_engine(db_uri, convert_unicode=True)

    # Create our scoped database session and bind to the engine
    db_session = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine)
    )
    # Attach database session to all models
    Model.db_session = db_session

    # Attach query property to all models
    Model.query = db_session.query_property()

    return db_session
