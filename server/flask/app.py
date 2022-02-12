
from flask import jsonify, Flask, request
from flask_cors import CORS
from mongo.mongo   import Database
#import numpy as np



# Flask application
APP = Flask(__name__)
# In order to accept external requests
CORS(APP)
APP.config['SECRET_KEY'] = 'dev'





# Add block
#@APP.route('/addBlock', methods=['POST'])
#def addBlock():
    

# Launch mission
@APP.route('/notes', methods=['POST'])
def launch():
    mongo = Database()
    return mongo.upload_block(request.json)


@APP.route('/local_notes/<min_x>/<max_x>/<min_y>/<max_y>')
def terminate(min_x,max_x,min_y,max_y):
    mongo = Database()
    res = mongo.get_all_blocks_in_range(min_x,max_x,min_y,max_y)
    for test in res :
       test['_id'] = str(test['_id'])
    return {'Notes':res}


database = Database()
database.test_get_all_blocks()    

if __name__ == '__main__':
    print('The backend is running on port 5000')
    APP.run(host = "localhost", debug=True, port=5000)
