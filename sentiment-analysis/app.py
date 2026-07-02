import os
from flask import Flask, render_template, request, jsonify
from transformers import pipeline

# Initialize the Flask application
app = Flask(__name__)

# Initialize the Sentiment Analysis pipeline
# This loads the "AI Brain" into memory when the app starts
print("Loading AI model...")
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
classifier = pipeline("sentiment-analysis", model=model_name)

@app.route('/')
def index():
    """Renders the main web page (UI)."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handles the prediction request from the browser."""
    try:
        # Get the text input from the user
        data = request.json
        text = data.get('text', '').strip()

        # Check if text is empty
        if not text:
            return jsonify({"error": "Please enter some text."}), 400

        # Run the text through the AI model
        result = classifier(text)[0]
        
        # Return the result as JSON
        return jsonify({
            "label": result['label'],
            "score": f"{result['score'] * 100:.2f}%",
            "sentiment": result['label'].lower()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Hugging Face Spaces requires the app to run on port 7860
    app.run(host='0.0.0.0', port=7860, debug=False)