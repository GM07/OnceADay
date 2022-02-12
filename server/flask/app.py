from enum import Enum
from pickle import NONE
from flask import jsonify, Flask, request
from flask_cors import CORS




# Flask application
APP = Flask(__name__)
# In order to accept external requests
CORS(APP)
APP.config['SECRET_KEY'] = 'dev'





# Add block
#@APP.route('/addBlock', methods=['POST'])
#def addBlock():
    

# Launch mission
@APP.route('/launch', methods=['POST'])
def launch():
    if(get_mission_started()):
        return ''

    is_simulated = request.get_json()
    print("launch")
    if is_simulated:
        COMM_SIMULATION.send_command(COMMANDS.LAUNCH.value)
    else:
        COMM_CRAZYFLIE.send_command(COMMANDS.LAUNCH.value, URI[0])
        COMM_CRAZYFLIE.send_command(COMMANDS.LAUNCH.value, URI[1])
    
    set_mission_simulated(is_simulated)
    set_mission_started(True)
    update_status()
    return 'Launched'

# Terminate mission
@APP.route('/terminate')
def terminate():
    if(not get_mission_started()):
        return ''

    if get_mission_simulated():
        COMM_SIMULATION.send_command(COMMANDS.LAND.value)
    else:
        COMM_CRAZYFLIE.send_command(COMMANDS.LAND.value, URI[0])
        COMM_CRAZYFLIE.send_command(COMMANDS.LAND.value, URI[1])

    set_mission_started(False)
    update_status()
    return ''



if __name__ == '__main__':
    print('The backend is running on port 5000')
    SOCKETIO.run(APP, debug=False, host='0.0.0.0', port=5000)
