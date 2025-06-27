from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)

# ✅ Load model
model = load_model("waste_classifier_model.keras")

# ✅ Make sure this order matches your training class order!
class_labels = ['biodegradable', 'recyclable', 'trash']  # Update this as per actual folder names in training dataset

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    img_file = request.files['image']
    try:
        # ✅ Load and preprocess image like training
        img = Image.open(BytesIO(img_file.read())).convert('RGB')
        img = img.resize((224, 224))
        img_array = img_to_array(img) / 255.0  # same rescaling
        img_array = np.expand_dims(img_array, axis=0)

        # ✅ Prediction
        prediction = model.predict(img_array)
        predicted_class_index = np.argmax(prediction[0])
        predicted_label = class_labels[predicted_class_index]

        return jsonify({'prediction': predicted_label})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
