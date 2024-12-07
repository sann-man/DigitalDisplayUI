from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#bug reports
REPORT_FOLDER = 'report'

# create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# route to serve uploaded files
@app.route('/uploads/<path:filename>')
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    station = request.form.get('station')
    meal = request.form.get('meal')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create station/meal subdirectories
        station_dir = os.path.join(app.config['UPLOAD_FOLDER'], station, meal)
        os.makedirs(station_dir, exist_ok=True)
        
        file_path = os.path.join(station_dir, filename)
        file.save(file_path)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename,
            'path': f'/uploads/{station}/{meal}/{filename}'
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/files/<station>/<meal>', methods=['GET'])
def get_files(station, meal):
    directory = os.path.join(app.config['UPLOAD_FOLDER'], station, meal)
    try:
        files = os.listdir(directory)
        return jsonify({'files': files})
    except FileNotFoundError:
        return jsonify({'files': []})

@app.route('/delete/<station>/<meal>/<filename>', methods=['DELETE'])
def delete_file(station, meal, filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], station, meal, filename)
    try:
        os.remove(file_path)
        return jsonify({'message': 'File deleted successfully'})
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

@app.route('/main')
def home():
    return render_template('main.html')

@app.route('/login')
def login():
    return render_template('login.html')

if __name__ == "__main__":
    app.run(debug=True)