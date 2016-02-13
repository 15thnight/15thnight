from flask import Flask, render_template, g, redirect, url_for, request, session, flash, g
from functools import wraps
from flask.ext.login import login_user, logout_user, current_user, login_required, LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt 
from functools import wraps
import gc

app = Flask('15thnight')
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///testing.db'
app.secret_key = 'my precious'
db = SQLAlchemy(app)
from forms import RegisterForm
from forms import LoginForm
from forms import AlertForm
from models import *

# login required decorator
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if 'logged_in' in session:
            return f(*args, **kwargs)
        else:
            flash('You need to login first.')
            return redirect(url_for('login'))
    return wrap

@app.route('/')
def index():
    return render_template('base.html')

@app.route('/register', methods=['GET','POST'])
def register():
	form = RegisterForm()
	data = ['Shelter','Clothes','Food','Other']
	if request.method == 'POST' and form.validate():
		selected_users = request.form.getlist("tags")
		user = User(
			email=form.email.data,
			password=form.password.data,
			phone_number=form.phone_number.data,
			other=form.other.data,
			shelter=form.shelter.data,
			food=form.food.data,
			clothes=form.clothes.data
			)
		
		db.session.add(user)
		db.session.commit()
		
		session['logged_in'] = True
		login_user(user)
		flash("You have registered!")
		return redirect(url_for('dashboard'))
	return render_template('register.html', form=form, data=data)

# route for handling the login page logic
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    form = LoginForm(request.form) #creates instance of form
    if request.method == 'POST':
        if form.validate_on_submit():
            user = User.query.filter_by(email=request.form['email']).first()
            if user is not None and bcrypt.check_password_hash(user.password, request.form['password']):
                session['logged_in'] = True #session cookie in browser
                login_user(user)
                flash('You were logged in.')
                return redirect(url_for('dashboard'))
                error = 'Invalid Credentials. Please try again.'
            else:
                error = 'Invalid Credentials. Please try again.'
    return render_template('login.html',form=form, error=error)


@login_required
@app.route('/dashboard', methods=['GET','POST'])
def dashboard():
	#alerts = db.session.query(Alert).all()
	user = User.query.filter_by(id=current_user.id).first()
	alerts = user.alerts.all()
	form = AlertForm()
	if request.method == 'POST' and form.validate_on_submit():
		alert = Alert(
			description=form.description.data,
			other=form.other.data,
			shelter=form.shelter.data,
			food=form.food.data,
			clothes=form.clothes.data,
			user_id= current_user.id #user id
			)
		db.session.add(alert)
		db.session.commit()
	
	return render_template('dashboard.html',form=form, alerts=alerts)
@login_required
@app.route("/logout")
def logout():
	session.clear()
	gc.collect()
	flash('You have been logged out!')
	return redirect(url_for('register'))

@login_manager.user_loader #required for flask login
def load_user(id):
    return User.query.get(int(id))


@app.route('/health')
def healthcheck():
    return 'ok', 200

if __name__ == '__main__':
    app.run(debug=True)