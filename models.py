from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# modify this model
class Pests(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return self.name
