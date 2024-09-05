from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__='user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(30), unique=True, nullable=False)
    firstName = db.Column(db.String(20), nullable=False)
    lastName = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    isActive = db.Column(db.Boolean(), unique=False, nullable=False)
    userType= db.Column(db.String(10), nullable=False, default='cliente') #Posible error.

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstName": self.firstName, #Posible error
            "lastName": self.lastName, #Posible error
            "password":self.password,
            "isActive":self.isActive,
            "userType": self.userType #Error comas
            # do not serialize the password, its a security breach
        }
    
class Stock(db.Model):
    __tablename__='stock'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(30), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    type=db.Column(db.Integer, nullable=False)
    image= db.Column(db.String(250), nullable=False)
    def __repr__(self):
        return f'<Stock {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "description": self.description,
            "quantity": self.quantity,
            "type": self.type,
            "image": self.image 
        }
    
class Form(db.Model):
    __tablename__='form'
    id = db.Column(db.Integer, primary_key=True)
    initialDate = db.Column(db.Date, nullable=False) #Falta type.
    finalDate = db.Column(db.Date, nullable=False)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'),nullable=False)
    user_relationship =db.relationship("User")
    
    def __repr__(self):
        return f'<form {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "initialDate": self.initialDate,
            "finalDate": self.finalDate,
            "type": self.type, #Posible error
            "userId": self.userId #Posible error
        }
    
class DetailForm(db.Model):
    __tablename__='detailForm'
    id = db.Column(db.Integer, primary_key=True)
    formId = db.Column(db.Integer, db.ForeignKey('form.id'),nullable=False)
    form_relationship =db.relationship("Form")
    stockId = db.Column(db.Integer, db.ForeignKey('stock.id'),nullable=False)
    stock_relationship =db.relationship("Stock")
    description = db.Column(db.String(30), nullable=False)
    quantity = db.Column(db.String(30), nullable=False)
    type = db.Column(db.String(30), nullable=False)
    
    
    def __repr__(self):
        return f'<detailForm {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "formId": self.formId,
            "stockId": self.stockId, #Posible error
            "description": self.description,
            "quantity": self.quantity,
            "type": self.type
        }