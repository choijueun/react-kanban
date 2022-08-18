# -*- coding: utf-8 -*-
import os
from flask import Flask, send_from_directory, request, jsonify, session
from flask_cors import CORS
from threading import Lock

import adb


async_mode = None
app = Flask(__name__, static_folder='react-app/build') # Change your react-app name 'my-react-app'
app.config['SECRET_KEY'] = os.urandom(20)
thread_lock = Lock()
CORS(app)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



from views import *

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8338, debug=True) # You can change port, host..
"""

    
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(20)


from views import *


if __name__ == "__main__":
    app.run(host='localhost', port=8888, debug=True)
"""
