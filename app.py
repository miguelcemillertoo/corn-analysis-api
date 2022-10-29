from flask import Flask
from models import db

app = Flask(__name__)
app.config.from_object('config.Config')
app.app_context().push()
db.init_app(app)

from views import *

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
