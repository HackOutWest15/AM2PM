from voluptuous import Schema, REMOVE_EXTRA, Any

_schedule = Schema([{
    "name": Any(str, unicode),
    "venue": Any(str, unicode),
    "start_date": Any(str, unicode),
    "start_time": Any(str, unicode),
    "end_date": Any(str, unicode),
    "end_time": Any(str, unicode)
}], extra=REMOVE_EXTRA, required=True)


def schedule(data):
    return _schedule(data)


_artist_list = Schema({
    "name": {
        "$in": [Any(str, unicode)]
    }
}, extra=REMOVE_EXTRA, required=True)


def artist_list(data):
    return _artist_list(data)
