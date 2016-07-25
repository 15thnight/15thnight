"""15th Night Flask App."""

from flask import (
    Flask, render_template, redirect, url_for, request, session, flash
)
from flask.ext.login import (
    login_user, current_user, login_required, LoginManager
)
from werkzeug.exceptions import HTTPException

from _15thnight import database
from _15thnight.api import account_api, alert_api, response_api, user_api
from _15thnight.core import send_out_alert, respond_to_alert
from _15thnight.database import db_session
from _15thnight.email_client import send_email, verify_email
from _15thnight.forms import (
    RegisterForm, LoginForm, AlertForm, ResponseForm, DeleteUserForm
)
from _15thnight.models import User, Alert, Response
from _15thnight import queue
from _15thnight.twilio_client import send_sms


app = Flask(__name__)

try:
    app.config.from_object('config')
except:
    app.config.from_object('configdist')

app.secret_key = app.config['SECRET_KEY']

app.register_blueprint(alert_api, url_prefix='/api/v1')
app.register_blueprint(account_api, url_prefix='/api/v1')
app.register_blueprint(response_api, url_prefix='/api/v1')
app.register_blueprint(user_api, url_prefix='/api/v1')

queue.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(id):
    """User loading needed by Flask-Login."""
    return User.query.get(int(id))


@app.teardown_appcontext
def shutdown_session(response):
    """Database management."""
    database.db_session.remove()


@app.errorhandler(404)
@app.errorhandler(Exception)
def error_page(error):
    """Generic Error handling."""
    code = 500
    if isinstance(error, HTTPException):
        code = error.code

    print(error)
    return render_template("error.html", error_code=code), code


@app.route('/')
def index():
    """Handle routing to the dashboard if logged in or the login page."""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Route for handling the login page logic."""
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))

    # creates instance of form
    form = LoginForm(request.form)
    if request.method == 'POST':
        if form.validate_on_submit():
            user = User.get_by_email(request.form['email'].lower())
            passwd = request.form.get("password")
            if user is not None and user.check_password(passwd):
                # session cookie in browser
                session['logged_in'] = True
                login_user(user)
                flash('Logged in successfully.', 'success')
                return redirect(
                    request.args.get('next') or url_for('dashboard')
                )
            else:
                flash('Invalid Credentials. Please try again.', 'danger')

    return render_template('login.html', form=form)


@app.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    """Dashboard."""
    if current_user.role == 'admin':
        # Admin user, show register form
        form = RegisterForm()
        form_error = False
        deleted_user = session.pop('deleted_user', False)
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
            verify_email(user.email)
            flash('User registered succesfully', 'success')
            return redirect(url_for('dashboard'))
        elif request.method == 'POST' and not form.validate_on_submit():
            form_error = True
        return render_template(
            'dashboard/admin.html',
            form=form,
            form_error=form_error,
            users=User.get_users(),
            alerts=Alert.get_alerts(),
            delete_user_form=DeleteUserForm(),
            deleted_user=deleted_user
        )
    elif current_user.role == 'advocate':
        # Advocate user, show alert form
        form = AlertForm()
        if request.method == 'POST' and form.validate_on_submit():
            send_out_alert(form)
            flash('Alert sent successfully', 'success')
            return redirect(url_for('dashboard'))

        return render_template('dashboard/advocate.html', form=form)
    else:
        # Provider user, show alerts
        return render_template(
            'dashboard/provider.html',
            user=current_user,
            alerts=Alert.get_active_alerts_for_provider(current_user)
        )


@app.route('/delete_user', methods=['POST'])
@login_required
def delete_user():
    if current_user.role != 'admin':
        flash('Access denied', 'danger')
        return redirect(url_for('dashboard'))
    form = DeleteUserForm()
    if form.validate_on_submit():
        user = User.get(form.id.data)
        user.delete()
        flash('User Deleted Successfully', 'success')
    else:
        flash('Failed to delete user', 'danger')
    session['deleted_user'] = True
    return redirect(url_for('dashboard'))


@app.route("/logout")
@login_required
def logout():
    """User logout."""
    session.clear()
    flash('You have been logged out!', 'success')
    return redirect(url_for('index'))


@app.route('/health')
def healthcheck():
    """Low overhead health check."""
    return 'ok', 200


@app.route('/about')
def about():
    """Simple about page route."""
    return render_template('about.html')


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        flash('you tried to make a post')
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        send_email(to=email, subject="Contact Form", body=message)
        return redirect(url_for('login'))
    return render_template('contact.html')


@app.route('/respond_to/<int:alert_id>', methods=['GET', 'POST'])
@login_required
def response_submitted(alert_id):
    """
    Action performed when a response is provided.

    Text the creator of the alert:
        - email, phone, and things able to help with of the responding user.
    """
    if request.method == 'POST':
        submitted_message = request.form['message']
        responding_user = current_user
        try:
            alert = Alert.query.get(int(alert_id))
        except Exception as e:
            return 'Error {}'.format(e), 404

        respond_to_alert(current_user, request.form['message'], alert)

        flash(
            'Your response has been sent to the advocate, thank you!',
            'success'
        )
        return redirect(url_for('dashboard'))
    else:
        try:
            alert = Alert.query.get(int(alert_id))
        except Exception as e:
            return 'Error {}'.format(e), 404

        return render_template(
            'respond_to.html',
            alert=alert, user=current_user, form=ResponseForm()
        )

if __name__ == '__main__':
    app.run(debug=True)
