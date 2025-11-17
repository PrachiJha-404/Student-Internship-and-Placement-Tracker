from flask import Flask
from flask_cors import CORS
from routes.company_routes import company_bp
from routes.user_routes import user_bp
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(company_bp)
app.register_blueprint(user_bp)
if __name__ == '__main__':
    app.run(debug=True)