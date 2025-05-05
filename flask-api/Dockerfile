FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    cmake \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies early (for Docker caching)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Optional: pre-download sentence-transformer model to avoid on-start download
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Download Mistral GGUF model
RUN mkdir -p models && \
    curl -L -o models/mistral-7b-instruct-v0.1.Q4_K_M.gguf \
    https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf

# Copy all source files (after installing dependencies)
COPY . .

# Expose Flask port
EXPOSE 5000

# Start: preload ChromaDB then launch API
CMD ["bash", "-c", "python preload_data.py && python app.py"]