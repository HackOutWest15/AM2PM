from flask import Flask, g, abort, request
from database import Database
import simplejson as json
from errors import *
from flask.ext.cors import CORS
import pymongo
import hashlib
import validator

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


@app.route("/schedule", methods=["POST"])
def generate_schedule():
    json_data = request.get_json(force=True)
    print json_data
    if json_data is not None:
        schedule = g.db.get_artists({"name": {"$in": json_data}})
        return json.dumps(schedule)
    else:
        abort(400)


@app.route("/schedule", methods=["PUT"])
def save_schedule():
    schedule = request.get_json(force=True)
    print schedule
    if schedule is not None:
        _hash = hashlib.md5().hexdigest()
        g.db.insert_data("schedules", {"hash": _hash, "schedule": validator.schedule(schedule)})
        return _hash
    else:
        abort(400)


@app.route("/schedule/<_hash>")
def get_schedule(_hash):
    return json.dumps(g.db.find_one("schedules", {"hash": _hash})["schedule"])


@app.route("/artists/<id>")
def get_artist(id):
    try:
        return json.dumps(g.db.get_artist({"id": id}))
    except NoResultError:
        abort(404)


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
