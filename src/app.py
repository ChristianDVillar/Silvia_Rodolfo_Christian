"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_cors import CORS
from flask_jwt_extended import create_access_token #Importamos las librerias necesarias.
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from datetime import timedelta #Importamos "timedelta" de datetime para modificar el tiempo de expiración de nuestro token.
from flask_bcrypt import Bcrypt

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY") #Método para traer variables.
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

@app.route('/register', methods=['POST'])
def register():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify ({'msg': 'Fields cannot be left empty'}), 400 #Verificamos que los campos no estén vacíos body['campo']
    if not body['firstName']:
        return jsonify({'msg': 'The firstName field cannot be empty'}), 400
    if not body['lastName']:
        return jsonify({'msg': 'The lastName field cannot be empty'}), 400
    if not body['email']:
        return jsonify({'msg': 'The email field cannot be empty'}), 400
    if not body['password']:
        return jsonify({'msg': 'The password field cannot be empty'}), 400
    user = User.query.filter_by(email=body['email']).first() #Buscamos el primer(.first()) usuario por email.
    if user:
        return jsonify({"msg": "The user already exists"}), 400
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8') #Encriptamos la contraseña.
    new_user = User()
    new_user.firstName = body['firstName']
    new_user.lastName = body['lastName']
    new_user.email = body['email']
    new_user.password = pw_hash
    new_user.isActive = True
    new_user.userType = 'cliente'
    db.session.add(new_user)
    db.session.commit()
    return jsonify ({'msg': 'New User Created'}), 201

@app.route('/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify ({'msg': 'Fields cannot be left empty'}), 400 #Verificamos que los campos no estén vacíos body['campo']
    if not body['email']:
        return jsonify ({'msg': 'The email field cannot be empty'}), 400
    if not body['password']:
        return jsonify ({'msg': 'The password field cannot be empty'}), 400
    user= User.query.filter_by(email=body['email']).first() #Buscamos al usuario mediante su email.
    if user is None:
        return jsonify ({'msg': 'User o password invalids'}), 400
    password_db = user.password #accedemos a la contraseña del usuario.
    password_true = bcrypt.check_password_hash(password_db, body['password']) #Comparamos la contraseña de la BD(encriptada) con la que ingresó el usuario.
    if password_true is False: #Si las contraseñas no son iguales retornamos un mensaje de error:
        return jsonify ({'msg': 'User o password invalids'}), 400
    #Si todo es ok se genera el token y se le entrega al usuario:
    expires = timedelta(hours=1) #Tiempo de expiración del token.
    acces_token = create_access_token(identity = user.email, expires_delta = expires) #Creamos el token con la configuración de expiración.
    return jsonify ({'msg': 'ok',
                     'jwt_token': acces_token}), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
    '''@app.route('/promote_to_admin', methods=['POST'])
def promote_to_admin():
    if current_user.user_type != "admin":  # Solo un admin puede promover
        return jsonify({"msg": "Access denied"}), 403

    data = request.get_json()
    user_id = data.get('user_id')

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.user_type = "admin"
    db.session.commit()

    return jsonify({"msg": f"User {user.email} promoted to admin"}), 200'''

