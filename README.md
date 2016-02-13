#15th Night App


# Standard development installation

    $ git clone https://github.com/15thnight/15thnight
    $ cd 15thnight
    $ virtualenv venv
    $ echo "export PYTHONPATH=$(pwd)" >> venv/bin/activate
    $ source venv/bin/activate
    $ pip install -r requirements.txt
    $ alembic upgrade head

# Custom config

    $ cp configdist.py config.py

Here is an example custom config.py file:

    from configdist import *

    DATABASE_URL = 'mysql://db_user:db_pass@db_host/db_name'

# Running DB migrations

To update the database to the latest version, run this command:

    $ alembic upgrade head

# Running the development server

    $ ./manage.py runserver -dr

Go to [localhost:5000](http://localhost:5000) in your browser.