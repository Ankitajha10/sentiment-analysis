# 1. Use a stable Python version
FROM python:3.10-slim

# 2. Set up a user for security (Hugging Face requirement)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# 3. Set the working directory inside the container
WORKDIR $HOME/app

# 4. Copy the requirements file and install libraries
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy all the other files (app.py, templates, etc.)
COPY --chown=user . .

# 6. Pre-download the AI model so the app starts instantly when opened
RUN python -c "from transformers import pipeline; pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')"

# 7. Tell the container to use port 7860
EXPOSE 7860

# 8. Start the Flask app using Gunicorn (a production-grade server)
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app"]