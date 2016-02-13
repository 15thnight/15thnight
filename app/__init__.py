from flask import Flask


app = Flask('15thnight')

@app.route('/')
def index():
    return 'web app'


if __name__ == '__main__':
    app.run()