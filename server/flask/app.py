from enum import Enum
from pickle import NONE
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
@APP.route('/local_blocks/<min_x>', methods=['POST'])
def launch():
    print(request.args)
    return (request.args)
    #if(request.args.get('min_x'))


@APP.route('/terminate/<min_x>/<max_x>/<min_y>/<max_y>')
def terminate(min_x,max_x,min_y,max_y):
    mongo = Database()
    res = mongo.get_all_blocks_in_range(min_x,max_x,min_y,max_y)
    for test in res :
       test['_id'] = str(test['_id'])
    return {'Notes':res}
    



if __name__ == '__main__':
    print('The backend is running on port 5000')
    APP.run(host = "localhost", debug=True, port=5000)
