# pylint: skip-file
from flask import jsonify, Flask, request
from flask_cors import CORS
from mongo.mongo import Database




# Flask application
APP = Flask(__name__)
# In order to accept external requests
CORS(APP)
APP.config['SECRET_KEY'] = 'dev'


@APP.route('/like/<id>', methods=['POST'])
def like(id):
    mongo = Database()
    return mongo.add_like(id)

@APP.route('/dislike/<id>', methods=['POST'])
def dislike(id):
    mongo = Database()
    return mongo.remove_like(id)

@APP.route('/notes', methods=['POST'])
def addNotes():
    mongo = Database()
    return mongo.upload_block(request.json)


@APP.route('/notes/<min_x>/<max_x>/<min_y>/<max_y>')
def getNotes(min_x, max_x, min_y, max_y):
    mongo = Database()
    return {'Notes': mongo.serialize_list(mongo.get_all_blocks_in_range(min_x, max_x, min_y, max_y))}


database = Database()
database.test_get_all_blocks()

if __name__ == '__main__':
    print('The backend is running on port 5000')
    APP.run(host="localhost", debug=True, port=5000)

