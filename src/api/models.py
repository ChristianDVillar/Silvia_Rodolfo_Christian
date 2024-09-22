from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timedelta
import enum
import uuid

db = SQLAlchemy()
# Definir el Enum en Python para UserType
class UserTypeEnum(enum.Enum):
    tecnico = "tecnico"
    usuario = "usuario"

class StockTypeEnum(enum.Enum):
    monitor = "monitor"
    teclado = "teclado"
    cable = "cable"
    mouse = "mouse"
    camara= "camara"
    
class User(db.Model):
    __tablename__='user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(30), unique=True, nullable=False)
    firstName = db.Column(db.String(20), nullable=False)
    lastName = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    isActive = db.Column(db.Boolean(), unique=False, nullable=False)
    # Definir userType como Enum con opciones "tecnico" y "usuario"
    userType = db.Column(Enum(UserTypeEnum), nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "password":self.password,
            "isActive":self.isActive,
            "usertype": self.userType.value  # Convertir el Enum a su valor (cadena)
            # do not serialize the password, its a security breach
        }
    
class Stock(db.Model):
    __tablename__='stock'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(30), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    stocktype=db.Column(Enum(StockTypeEnum), nullable=False)
    image= db.Column(db.String(250), nullable=False)
    def __repr__(self):
        return f'<Stock {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "quantity": self.quantity,
            "type": self.stocktype.value,  # Convertir el Enum a su valor (cadena)
            "image": self.image
        }
    
class Form(db.Model):
    __tablename__='form'
    id = db.Column(db.Integer, primary_key=True)
    date=db.Column(db.Date, nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    user_relationship =db.relationship("User")
    
    def __repr__(self):
        return f'<form:{self.id},Date:{self.date},User:{self.userId}>'

    def serialize(self):
        return {
            "id": self.id,
            "date":self.date,
            "userId": self.userId
        }
    
class DetailForm(db.Model):
    __tablename__='detailForm'
    id = db.Column(db.Integer, primary_key=True)
    formId = db.Column(db.Integer, db.ForeignKey('form.id'),nullable=False)
    form_relationship =db.relationship("Form")
    stockId = db.Column(db.Integer, db.ForeignKey('stock.id'),nullable=False)
    stock_relationship =db.relationship("Stock")
    description = db.Column(db.String(30), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    stocktype = db.Column(Enum(StockTypeEnum), nullable=False)
    initialDate = db.Column(db.Date, nullable=False)
    finalDate = db.Column(db.Date, nullable=False)
    
    
    def __repr__(self):
        return f'<detailForm {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "formId": self.formId,
            "stockId": self.stockId,
            "description": self.description,
            "quantity": self.quantity,
            "initialDate": self.initialDate,
            "finalDate": self.finalDate,
            "stocktype": self.stocktype.value,  # Convertir el Enum a su valor (cadena)
        }

# Modelo UserUUID
class UserUUID(db.Model):
    __tablename__ = 'user_uuid'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    uuid = db.Column(db.String(36), unique=True, nullable=False)  # UUID generado
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)  # Fecha de creación

    def is_expired(self):
        # Expira en 45 minutos
        expiration_time = self.created_at + timedelta(minutes=45)
        return datetime.utcnow() > expiration_time

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "uuid": self.uuid,
            "created_at": self.created_at
        }