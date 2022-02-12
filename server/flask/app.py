# pylint: skip-file
from flask import jsonify, Flask, request
from flask_cors import CORS
from mongo.mongo import Database
import json



# Flask application
APP = Flask(__name__)
# In order to accept external requests
CORS(APP)
APP.config['SECRET_KEY'] = 'dev'

@APP.route('/test')
def test():
    return "hi"

@APP.route('/like/<id>', methods=['POST'])
def like(id):
    mongo = Database()
    return json.dumps(mongo.add_like(id))

@APP.route('/dislike/<id>', methods=['POST'])
def dislike(id):
    mongo = Database()
    return json.dumps(mongo.remove_like(id))

@APP.route('/notes', methods=['POST'])
def add_notes():
    mongo = Database()
    return json.dumps(mongo.upload_block(request.json))


@APP.route('/notes/<min_x>/<max_x>/<min_y>/<max_y>')
def get_notes(min_x, max_x, min_y, max_y):
    mongo = Database()
    return json.dumps(mongo.serialize_list(mongo.get_all_blocks_in_range(min_x, max_x, min_y, max_y)))


@APP.route('/notes_by_text/<text>')
def find_notes_by_text(text):
    mongo = Database()
    return json.dumps(mongo.serialize_list(mongo.find_text(text)))


database = Database()
database.test_get_all_blocks()

if __name__ == '__main__':
    print('The backend is running on port 5000')
    APP.run(host="localhost", debug=True, port=5000)

