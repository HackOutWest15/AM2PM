from pymongo import MongoClient
from errors import NoResultError

ARTIST_COLLECTION = "artists"


class Database:

    def __init__(self):
        db_name = "am_pm"
        self.client = MongoClient()
        self.db = self.client[db_name]

    def __del__(self):
        self.client.close()

    def find(self, collection, args={}):
        return list(self.db[collection].find(args, projection={"_id": False}))

    def find_one(self, collection, args={}):
        result = self.db[collection].find_one(args, projection={"_id": False})
        if result is None:
            raise NoResultError()
        return dict(result)

    def insert_data(self, collection, data):
        self.db[collection].insert_one(data)

    ###########
    # ARTISTS #
    ###########

    def get_artists(self, args={}):
        return self.find(ARTIST_COLLECTION, args)

    def get_artist(self, args={}):
        return self.find_one(ARTIST_COLLECTION, args)
