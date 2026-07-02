async function analyzeSentiment() {
    const text = document.getElementById('userInput').value;
    if (!text) { alert("Please enter some text!"); return; }

    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('resultContainer').classList.add('hidden');

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text })
        });
        const data = await response.json();

        document.getElementById('sentimentLabel').innerText = data.label;
        document.getElementById('confidenceScore').innerText = data.score;
        
        const resultCard = document.getElementById('resultCard');
        resultCard.className = data.sentiment === 'positive' ? 'positive' : 'negative';
        
        document.getElementById('resultContainer').classList.remove('hidden');
    } catch (e) {
        alert("Error analyzing sentiment.");
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
}