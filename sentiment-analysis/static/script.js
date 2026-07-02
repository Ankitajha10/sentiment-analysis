async function analyzeSentiment() {
    const textInput = document.getElementById('userInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loading = document.getElementById('loading');
    const resultContainer = document.getElementById('resultContainer');
    const validationMsg = document.getElementById('validationMsg');
    const resultCard = document.getElementById('resultCard');
    const sentimentLabel = document.getElementById('sentimentLabel');
    const confidenceScore = document.getElementById('confidenceScore');

    const text = textInput.value.trim();

    // 1. Validation
    if (!text) {
        validationMsg.classList.remove('hidden');
        textInput.style.borderColor = '#dc2626';
        return;
    }

    // Reset UI
    validationMsg.classList.add('hidden');
    textInput.style.borderColor = '#d1d5db';
    resultContainer.classList.add('hidden');
    
    // 2. Show Loading Spinner
    loading.classList.remove('hidden');
    analyzeBtn.disabled = true;

    try {
        // 3. API Request to Flask
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();

        if (response.ok) {
            // 4. Update UI with Results
            sentimentLabel.innerText = data.label;
            confidenceScore.innerText = data.score;
            
            // Set colors based on sentiment
            resultCard.className = data.sentiment === 'positive' ? 'positive' : 'negative';
            
            resultContainer.classList.remove('hidden');
        } else {
            alert(data.error || "An error occurred");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Server error. Please try again later.");
    } finally {
        // 5. Hide Loading Spinner
        loading.classList.add('hidden');
        analyzeBtn.disabled = false;
    }
}