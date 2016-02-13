from flask import Flask, render_template, g, redirect, url_for, request, session, flash, g
from functools import wraps
from flask.ext.login import login_user, logout_user, current_user, login_required, LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt 

app = Flask('15thnight')
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///post.db'
app.secret_key = 'my precious'
db = SQLAlchemy(app)
from forms import RegisterForm
from models import *
@app.route('/')
def index():
    return 'hello'

@app.route('/register', methods=['GET','POST'])
def register():
	form = RegisterForm()
	if request.method == 'POST' and form.validate():
		user = User(
			email=form.email.data,
			password=form.password.data,
			phone_number=form.phone_number.data)

		db.session.add(user)
		db.session.commit()
		session['logged_in'] = True

@app.route('/health')
def healthcheck():
    return 'ok', 200

if __name__ == '__main__':
    app.run()