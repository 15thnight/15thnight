# 15th Night App

# Development Requirements

- python2.X
- pip
- virtualenv
- git
- RabbitMQ

# Standard Development Installation

    $ git clone https://github.com/15thnight/15thnight
    $ cd 15thnight
    $ virtualenv venv
    $ echo "export PYTHONPATH=$(pwd)" >> venv/bin/activate
    $ source venv/bin/activate
    $ pip install -r requirements.txt

At this point, you will have the project downloaded along with the python packages.

# Setup Database

### SQLite (no migrations)

For simple development, use sqlite and create the database with the following command:

    $ ./manage.py create_db

### PostgreSQL/MySQL (migrations)

To create the database via migrations, MySQL or PostgreSQL must be used as the database (see the custom config example below). This command will create the database and run all migrations (**NOTE** this is also the same command used to keep the database up to date with any future migrations):

    $ alembic upgrade head

For more information on how the project migrations work, refer to the [alembic documentation](http://alembic.readthedocs.io/en/latest/).

# Custom Config

To customize the configuration, simply copy the distribution config file and then edit `config.py`:

    $ cp configdist.py config.py

Here is an example of a minimal config.py file that imports default values and overwrites only the database URL:

    from configdist import *

    DATABASE_URL = 'mysql://db_user:db_pass@db_host/db_name'

# Running the Development Server

    $ ./manage.py runserver -dr

Go to [localhost:5000](http://localhost:5000) in your browser.

# Creating a User

    $ ./manage.py create_user <email> <password> <role>

Example:

    $ ./manage.py create_user user@example.com password admin

Seed the database with the test users (refer to the source code for the user details):

    $ ./manage.py seed_db

# Hosting

### Create the WSGI File

Create a WSGI file for Apache/nginx:

    $ sed "s?PROJECT_PATH?$(pwd)?g" 15thnight.wsgi.template > 15thnight.wsgi