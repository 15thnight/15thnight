from flask import Flask, render_template, redirect, url_for, request, session, flash, g
from functools import wraps
from flask.ext.login import login_user, logout_user, current_user, login_required, LoginManager
from sqlalchemy import or_

from app import database 
from app.forms import RegisterForm, LoginForm, AlertForm
from app.models import User, Alert

from functools import wraps
import gc

from twilio_client import send_sms

flaskapp = Flask(__name__)
try:
    flaskapp.config.from_object('config')
except: 
    flaskapp.config.from_object('configdist')

flaskapp.secret_key = flaskapp.config['SECRET_KEY']

login_manager = LoginManager()
login_manager.init_app(flaskapp)
login_manager.login_view = 'login'

@login_manager.user_loader #required for flask login
def load_user(id):
    return User.query.get(int(id))

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

@flaskapp.route('/')
def index():
    return render_template('base.html')

@flaskapp.route('/register', methods=['GET','POST'])
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
        
        database.db_session.add(user)
        database.db_session.commit()
        
        session['logged_in'] = True
        login_user(user)
        flash("You have registered!")
        return redirect(url_for('dashboard'))
    return render_template('register.html', form=form, data=data)

# route for handling the login page logic
@flaskapp.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    form = LoginForm(request.form) #creates instance of form
    if request.method == 'POST':
        if form.validate_on_submit():
            user = User.query.filter_by(email=request.form['email']).first()
            if user is not None and user.check_password(request.form['password']):
                session['logged_in'] = True #session cookie in browser
                login_user(user)
                flash('You were logged in.')
                return redirect(url_for('dashboard'))
                error = 'Invalid Credentials. Please try again.'
            else:
                error = 'Invalid Credentials. Please try again.'
    return render_template('login.html',form=form, error=error)



@flaskapp.route('/dashboard', methods=['GET','POST'])
#@login_required
def dashboard():
    #alerts = database.db_session.query(Alert).all()
    user = User.query.filter_by(id=1).first()
    alerts = user.alerts.all()
    form = AlertForm()
    if request.method == 'POST' and form.validate_on_submit():
        alert = Alert(
            description=form.description.data,
            other=form.other.data,
            shelter=form.shelter.data,
            food=form.food.data,
            clothes=form.clothes.data,
            user_id= 1 #user id
            )
        database.db_session.add(alert)
        database.db_session.commit()
        users_to_notify = User.query.filter(or_(
                User.food == alert.food,
                          User.shelter == alert.shelter,
                           User.clothes == alert.clothes
        ))
        for user in users_to_notify:
            print("found user to notify {}".format(user))
            send_sms(to_number=user.phone_number, body="There is a new 15th night alert. Go to <link> to check it out.")

    
    return render_template('dashboard.html',form=form, alerts=alerts)

@flaskapp.route("/logout")
@login_required
def logout():
    session.clear()
    gc.collect()
    flash('You have been logged out!')
    return redirect(url_for('register'))

@flaskapp.route('/health')
def healthcheck():
    return 'ok', 200

@flaskapp.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    flaskapp.run(debug=True)