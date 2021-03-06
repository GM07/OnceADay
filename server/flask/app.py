# pylint: skip-file
from crypt import methods
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

@APP.route('/users',methods=['POST'])
def add_user():
    mongo = Database()
    return mongo.add_user_position(request.json)

@APP.route('/users')
def get_users():
    mongo = Database()
    return json.dumps(mongo.serialize_list(mongo.fetch_all_users()))

if __name__ == '__main__':
    print('The backend is running on port 5000')
    APP.run(host="0.0.0.0", debug=True, port=5000)

