from __future__ import with_statement

import re

from alembic import context
from sqlalchemy import engine_from_config, pool
from logging.config import fileConfig

from _15thnight import models
from _15thnight.database import Model

# Tests will never use migration (at least in the forseable future)
# therefor this method of checking for the DATABASE_URI is ok here
try:
    from config import DATABASE_URI
except:
    from configdist import DATABASE_URI

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Model.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()

def compare_type(context, inspected_column,
            metadata_column, inspected_type, metadata_type):
    replace = dict(
        VARCHAR='String',
        TINYINT='Boolean',
        BOOLEAN='Boolean',
        DATETIME='DateTime',
        INTEGER='Integer',
        TEXT='Text'
    )
    pattern = re.compile( '|'.join(replace.keys()))
    left = pattern.sub(lambda x: replace[x.group()],
        inspected_column.type.__class__.__name__)
    right = pattern.sub(lambda x: replace[x.group()],
        metadata_column.type.__class__.__name__)
    return left != right

def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.


    """
    alembic_config = config.get_section(config.config_ini_section)
    alembic_config['sqlalchemy.url'] = DATABASE_URI
    engine = engine_from_config(alembic_config, poolclass=pool.NullPool)

    connection = engine.connect()
    context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=compare_type
                )

    try:
        with context.begin_transaction():
            context.run_migrations()
    finally:
        connection.close()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
