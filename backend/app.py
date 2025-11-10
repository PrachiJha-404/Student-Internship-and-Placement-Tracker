from flask import Flask
from flask_cors import CORS
from routes.company_routes import company_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(company_bp)

if __name__ == '__main__':
    app.run(debug=True)