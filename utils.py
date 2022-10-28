import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename
from uuid import uuid4
import tensorflow
from keras.preprocessing import image
from glob import glob
import numpy as np
import matplotlib.pyplot as plt
import os
import cv2
from keras.models import load_model
import colour

def save_image(image, category):
    category = category.lower()+'s'
    UPLOAD_PATH_PEST = join(dirname(realpath(__file__)), 'static/images/' + category)

    if image.filename != '':
        filename = str(uuid4()) + secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_PATH_PEST, filename))
        # reset image before reading again 
        # https://github.com/pallets/werkzeug/issues/1666
        image.stream.seek(0)
        return filename

def path_to_tensor(img_path):
    # loads RGB image as PIL.Image.Image type
    img = image.load_img(img_path, target_size=(224, 224))
    # convert PIL.Image.Image type to 3D tensor with shape (224, 224, 3)
    x = image.img_to_array(img)
    # convert 3D tensor to 4D tensor with shape (1, 224, 224, 3) and return 4D tensor
    #print("New Shape ", np.expand_dims(x, axis=0).shape)
    return np.expand_dims(x, axis=0)

def predict_image(category, image_filename):
    category = category.lower()+'s'

    pest_classifier = load_model(join(dirname(realpath(__file__)), 'static/hdf5/pest-classifier.hdf5'))
    disease_classifier = load_model(join(dirname(realpath(__file__)), 'static/hdf5/disease-classifier.hdf5'))

    PEST_CATEGORIES = ['Asiatic Corn Borer', 'Black Armyworm', 'Common Cutworm', 'Corn Aphids', 'Corn Earworm', 'Corn Plant Hopper', 'Corn Seedling Maggot', 'Corn Semilooper', 'True Armyworm', 'White Grub']

    DISEASE_CATEGORIES = ['Aspergillus Ear Rot', 'Bacterial Stalk Rot', 'Banded Leaf and Sheath Blight', 'Common Corn Rust', 'Common Smut', 'Gray Leaf Spot', 'Leaf Blight', 'Philippine Corn Downey Mildew']

    # Image Path
    img_path = join(dirname(realpath(__file__)), 'static/images/' + category + '/') + image_filename

    x = path_to_tensor(img_path)
    x = np.array(x)

    if category == 'pests':
        prediction = np.argmax(pest_classifier.predict(x))
        # print('Predicted Pest: ',  str(PEST_CATEGORIES[prediction]))
        return str(PEST_CATEGORIES[prediction])
    else:
        prediction = np.argmax(disease_classifier.predict(x))
        # print('Predicted Disease: ',  str(DISEASE_CATEGORIES[prediction]))
        return str(DISEASE_CATEGORIES[prediction])

def predict_category(image, category):
    pest_disease_nutrient_classifier = load_model(join(dirname(realpath(__file__)), 'static/hdf5/pest-disease-nutrient-classifier.hdf5'))

    PEST_DISEASE_NUTRIENT_CATEGORIES = ['Disease', 'Nutrient', 'Pest']

    # save image to temp folder
    UPLOAD_PATH_TEMP = join(dirname(realpath(__file__)), 'static/images/temp')

    if image.filename != '':
        filename = str(uuid4()) + secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_PATH_TEMP, filename))

        # reset image before reading again 
        # https://github.com/pallets/werkzeug/issues/1666
        image.stream.seek(0)
        
        image_filename = filename

    # image path
    img_path = join(dirname(realpath(__file__)), 'static/images/temp/') + image_filename

    x = path_to_tensor(img_path)
    x = np.array(x)

    prediction = np.argmax(pest_disease_nutrient_classifier.predict(x))
    category_prediction = str(PEST_DISEASE_NUTRIENT_CATEGORIES[prediction])

    if category_prediction == category:
        return True
    else:
        return False


def delta_e(image_filename):
    IMG_SIZE = (200,200)
    NUTRIENT_CATEGORIES = ['2', '3', '4', '5']

    img_A_path = join(dirname(realpath(__file__)), 'static/images/nutrients/') + image_filename
    img_B_paths = [
    'static/prediction-data/images/nutrients/2.jpg',
    'static/prediction-data/images/nutrients/3.jpg',
    'static/prediction-data/images/nutrients/4.jpg',
    'static/prediction-data/images/nutrients/5.jpg']

    img_A = cv2.imread(img_A_path).astype("float32") / 255
    img_A = cv2.resize(img_A, IMG_SIZE)
    img_A = cv2.cvtColor(img_A,cv2.COLOR_BGR2LAB)

    delta_e_list = []
    for img_B_path in img_B_paths: 
        img_B = cv2.imread(img_B_path).astype("float32") / 255
        img_B = cv2.resize(img_B, IMG_SIZE)
        img_B = cv2.cvtColor(img_B,cv2.COLOR_BGR2LAB)

        # Calculate Delta-E
        delta_E = np.mean(colour.delta_E(img_A, img_B))

        # Append to list
        delta_e_list.append(delta_E)

    print(delta_e_list)
    prediction = NUTRIENT_CATEGORIES[np.argmin(delta_e_list)]
    print('THE PREDICTION IS #'+ prediction)

    return prediction


def face_detector(image):
    # extract pre-trained face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt.xml")
    
    # save image to temp folder
    UPLOAD_PATH_TEMP = join(dirname(realpath(__file__)), 'static/images/temp')

    print('UPLOAD PATH TEMP', UPLOAD_PATH_TEMP)

    if image.filename != '':
        filename = str(uuid4()) + secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_PATH_TEMP, filename))

        # reset image before reading again 
        # https://github.com/pallets/werkzeug/issues/1666
        image.stream.seek(0)
        
        image_filename = filename

    # image path
    img_path = join(dirname(realpath(__file__)), 'static/images/temp/') + image_filename

    # load color (BGR) image
    img = cv2.imread(img_path)
    # convert BGR image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # find faces in image
    faces = face_cascade.detectMultiScale(gray)

    # print number of faces detected in the image
    # print('Number of faces detected:', len(faces))

    # get bounding box for each detected face
    for (x,y,w,h) in faces:
        # add bounding box to color image
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        
    # convert BGR image to RGB for plotting
    cv_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # display the image, along with bounding box
    # plt.imshow(cv_rgb)
    # plt.show()

    # returns "True" if face is detected in image stored at img_path
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray)
    return len(faces) > 0


def clear_temp():
    files = glob(join(dirname(realpath(__file__)), 'static/images/temp/*'))
    for f in files:
        os.remove(f)


