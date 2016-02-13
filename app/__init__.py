from flask import Flask


app = Flask('15thnight')

@app.route('/')
def index():
    return 'web app'

@app.route('/health')
def healthcheck():
    return 'ok', 200

if __name__ == '__main__':
    app.run()