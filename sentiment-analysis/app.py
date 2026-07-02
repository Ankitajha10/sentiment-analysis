import os
from flask import Flask, render_template, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Initialize the Sentiment Analysis pipeline
# We use the DistilBERT model as it is lightweight and fast for deployment
# The model is loaded once when the server starts
print("Loading model... This might take a moment.")
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
classifier = pipeline("sentiment-analysis", model=model_name)

@app.route('/')
def index():
    """Renders the main web page."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handles the sentiment analysis request."""
    try:
        # Get data from the POST request
        data = request.json
        text = data.get('text', '').strip()

        # Validation: Check if input is empty
        if not text:
            return jsonify({"error": "Please enter some text to analyze."}), 400

        # Perform prediction
        result = classifier(text)[0]
        
        # Format the response
        label = result['label']
        score = result['score']
        
        return jsonify({
            "label": label,
            "score": f"{score * 100:.2f}%",
            "sentiment": label.lower()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Use environment port for deployment compatibility
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)