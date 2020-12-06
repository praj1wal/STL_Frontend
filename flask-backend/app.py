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
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print(filename)
            data = pd.read_excel(file)
            print()
            jsondata = {"length":data.shape[0], "district_id":list(data.iloc[:,0]), "district_name":list(data.iloc[:,1]), "samples":list(data.iloc[:,4])}
            return  jsondata
    return '''Error'''
            

app.run()