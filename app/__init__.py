from flask import Flask, render_template, redirect, url_for, request, session, flash, g
from functools import wraps
from flask.ext.login import login_user, logout_user, current_user, login_required, LoginManager
from sqlalchemy import or_
from app import database 
from app.forms import RegisterForm, LoginForm, AlertForm
from app.models import User, Alert
from app.email_client import send_email
from twilio_client import send_sms
from functools import wraps
import gc



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

@flaskapp.teardown_appcontext
def shutdown_session(response):
    database.db_session.remove()

# login required decorator
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if current_user.is_authenticated:
            return f(*args, **kwargs)
        else:
            flash('You need to login first.')
            return redirect(url_for('login'))
    return wrap

@flaskapp.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

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
            clothes=form.clothes.data,
            role=form.role.data
        )
        user.save()
        
        session['logged_in'] = True
        login_user(user)
        flash("You have registered!")
        return redirect(url_for('dashboard'))
    return render_template('register.html', form=form, data=data)

# route for handling the login page logic
@flaskapp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    error = None
    form = LoginForm(request.form) #creates instance of form
    if request.method == 'POST':
        if form.validate_on_submit():
            user = User.get_by_email(request.form['email'].lower())
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
@login_required
def dashboard():
    if current_user.role == 'admin':
        # Admin user, show register form
        form = RegisterForm()
        if request.method == 'POST' and form.validate_on_submit():
            user = User(
                email=form.email.data,
                password=form.password.data,
                phone_number=form.phone_number.data,
                other=form.other.data,
                shelter=form.shelter.data,
                food=form.food.data,
                clothes=form.clothes.data,
                role=form.role.data
            )
            user.save()
        return render_template('dashboard/admin.html', form=form)
    elif current_user.role == 'advocate':
        # Advocate user, show alert form
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
            alert.save()
            users_to_notify = User.get_provider(alert.food, alert.clothes, alert.shelter, alert.other)
            for user in users_to_notify:
                print("found user to notify {}".format(user))
                body = "There is a new 15th night alert. Go to <link> to check it out."
                send_sms(to_number=user.phone_number, body=body)
                send_email(user.email, '15th Night Alert', body)  
        return render_template('dashboard/advocate.html', form=form)
    else:
        # Provider user, show alerts
        return render_template('dashboard/provider.html', user=current_user)


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