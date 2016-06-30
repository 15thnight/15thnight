# 15th Night App

# Development

## Requirements

- python2.7
- pip
- virtualenv
- git

## Standard Development Installation

    $ git clone https://github.com/15thnight/15thnight
    $ cd 15thnight
    $ virtualenv venv
    $ echo "export PYTHONPATH=$(pwd)" >> venv/bin/activate
    $ source venv/bin/activate
    $ pip install -r requirements.txt

At this point, you will have the project downloaded along with the python packages.

## Customize Config

### Copy All Default Settings

To customize the entire default configuration, you can simply copy the distribution config file to `config.py` and then edit `config.py`:

    $ cp configdist.py config.py
    $ vim config.py

### Import Settings and Overwrite Individually

Another option is to import all the default settings and only overwrite certain settings. Here is an example of a minimal config.py file that imports default values and sets the database to a MySQL connection:

    from configdist import *

    DATABASE_URL = 'mysql://db_user:db_pass@db_host/db_name'

# Database

The `DATABASE_URL` string in the config file determines the engine and settings for the database connection. The default is a SQLite connection string that creates a `test.db` file. **NOTE:** migrations are not possible with SQLite

## Database Type

Postgres, MySQL and SQLite databases are supported.

### Postgres

Example postgres connection string:

    postgres://db_user:db_pass@db_host/db_name

### MySQL

In order to use MySQL, MySQL-python must be installed:

    pip install MySQL-python

Example MySQL connection string:

    mysql://db_user:db_pass@db_host/db_name

## Create the Database Tables

The database tables can either be created with migrations (recommended) or without.

For MySQL and Postgres databases, the database must be created first before creating the tables:

    CREATE DATABASE db_name

### Migrations (Postgres/MySQL)

To create the database tables via migrations, MySQL or PostgreSQL must be used as the database. This command will create the database tables and is also used to migrate the tables if there are any new migrations:

    $ alembic upgrade head

For more information on how the project migrations work, refer to the [alembic documentation](http://alembic.readthedocs.io/en/latest/).

### No Migrations (SQLite/Postgres/MySQL)

For simple development, such as with sqlite, create the database tables with the following command:

    $ ./manage.py create_db

Note that migrating the database tables to future versions is not possible when they are created with this command.

# Twilio

To use SMS features, a [Twilio](https://twilio.com) account is required. Follow these steps to set up twilio:

1. Sign up for an account at [twilio.com](https://twilio.com).
1. At the dashboard page, locate the `Account SID` and `Auth Token` values and set them in `config.py`. They correlate to the `TWILIO_ACCOUNT_SID` and `TWILIO_ACCONT_AUTH_TOKEN` settings, respectfully.
1. Click on the # button in the upper left to be taken to the phone numbers page.
1. Buy a phone number that has SMS capabilities and set the `TWILIO_FROM_NUMBER` in the config to that number. Make sure the number is in the format `+1XXXXXXXXXX`.

Twilio allows use of the twilio number and SMS capabilities for a little while as a trial account without paying.

# Creating a User

    $ ./manage.py create_user <email> <password> <role>

Example:

    $ ./manage.py create_user user@example.com password admin

Seed the database with the test users (refer to the source code for the user details):

    $ ./manage.py seed_db

## Running the Development Server

Begin by running celery:

    $ celery -A _15thnight.celery worker

Then start up the development web server with live reloading of python code changes (`r` flag) and debug output (`d` flag):

    $ ./manage.py runserver -dr

Go to [localhost:5000](http://localhost:5000) in your browser.

# Hosting a Production Server

To host the project from a production environment, first follow the instructions under Standard Development Installation and set up a database.

## Requirements

- Apache or nginx
- WSGI
- MySQL or PostgreSQL (recommended)
- Redis or RabbitMQ (recommended)

## Setup Celery

### Automatically (as root or with sudo)

    ./setup_celery.sh

### Manually

    # Change the 3 to the concurrency level desired
    sed \{"s?PROJECT_PATH?$(pwd)?g; s?THREAD_COUNT?3?g;"\} celeryd.template > celeryd.conf
    mv celeryd.conf /etc/default/celeryd
    cp celeryd.init /etc/init.d/celeryd
    useradd -M -r -s /bin/false celery

## Create the WSGI File

Create a WSGI file for Apache/nginx:

    $ sed "s?PROJECT_PATH?$(pwd)?g" 15thnight.wsgi.template > 15thnight.wsgi

## Apache Config

Create the apache config (this config assumes you have a _15thnight user added to a _15thnight group that has access to the project directory):

    $ sed "s?PROJECT_PATH?$(pwd)?g" 15thnight.apache.template
