import os
from flask import Flask, request, redirect, url_for, render_template, flash, send_from_directory
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 
  # This code comes from the Flask documentation
  # http://flask.pocoo.org/docs/0.12/patterns/fileuploads/
  # Learn more about how HTTP handles file uploads at
  # 

def allowed_file(filename):
    '''
        Returns true if there's an extension and the extension is allowed
    '''
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    '''
        GET: Displays a form
        POST: Checks for errors, saves the file, displays the file
    '''
    errorMsg = ""
    if request.method == 'POST':
        # do non-file fields first
        firstName = request.form['first-name']
        if firstName == "":
            errorMsg += "No first name. "
            print('No first name')
        # lasttName = request.form['last-name']
        # email = request.form['email']
        # if email == "":
        #     errorMsg += "No email<br>"
        #     print('No email')

        # check if the post request has the file part
        if 'file' not in request.files:
            print('No file part')
            errorMsg += "No file part. "
            return render_template("results.html", errorMsg=errorMsg, firstName=firstName,)
            #return redirect(request.url) # this sends the user back to where she came from
        file = request.files['file']
        # if user does not select file, browser also submits a empty part without filename
        if file.filename == '':
            print('No selected file')
            errorMsg += "No selected file. "
            return render_template("results.html", errorMsg=errorMsg, firstName=firstName,)
            #return redirect(request.url)
        print(file)
        if file and allowed_file(file.filename):
            # sanitize the file name to protect against malicious user input
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            # display the new file using a route constructed just for that file
            return render_template("results.html", errorMsg=errorMsg, firstName=firstName,  filepath=filepath)

    # GET - show the form
    return render_template('form.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run()