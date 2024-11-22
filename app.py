from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/main')
def home(): 
    return render_template('main.html')

@app.route('/login')  # Fixed: Added the leading slash
def login(): 
    return render_template('login.html')

if __name__ == "__main__": 
    app.run(debug=True)
