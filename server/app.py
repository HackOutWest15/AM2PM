from flask import Flask, g, abort
from database import Database
import simplejson as json
from errors import *
from flask.ext.cors import CORS

app = Flask(__name__)
CORS(app)


@app.before_request
def setup():
    g.db = Database()


@app.after_request
def teardown(response):
    del g.db
    return response


@app.route("/")
def home():
    return "home"


@app.route("/artists")
def get_artists():
    return json.dumps(g.db.get_artists())


@app.route("/artists/<id>")
def get_artist(id):
    try:
        return json.dumps(g.db.get_artist({"id": id}))
    except NoResultError:
        abort(404)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
