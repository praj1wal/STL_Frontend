import os
from werkzeug.utils import secure_filename
from flask import Flask, jsonify, request ,flash, redirect, url_for
import pandas as pd
app = Flask(__name__)
app.config["DEBUG"] = True
UPLOAD_FOLDER = './'
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        jsondata = []
        for i in request.files.keys():
            file = request.files[i]
            if file.filename == '':
                print('No selected file')
                return "Error"
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                print(filename)
                data = pd.read_excel(file)
                data.to_json()
                currdata = {"length":data.shape[0]}
                for col in data.columns:
                    currdata[col] = list(data[col])
                jsondata.append(currdata)
        return  jsonify(jsondata)
    return '''Error'''
            
if __name__ == "__main__":
    app.run()