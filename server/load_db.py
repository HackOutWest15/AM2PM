from database import Database
import simplejson as json


def clean(_dict):
    data = dict(remove_none(_dict))
    if data.has_key("tracks"):
        data["tracks"] = json.loads(data["tracks"])
    return data


def remove_none(_dict):
    for kv in _dict.iteritems():
        if kv[1] is not None:
            yield kv


db = Database()

with open("artist-data.json") as f:
    for artist_json in f:
        db.insert_data("artists", clean(json.loads(artist_json)))


del db
