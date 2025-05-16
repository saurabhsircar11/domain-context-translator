# 🌍 TranslateX

TranslateX is a full-stack translation tool designed to manage multilingual projects using a domain-specific, Mistral-7B-based LLM with a RAG-lite setup.

---

## 🚀 Features

- 🧠 Mistral 7B model with `llama-cpp-python`
- 🔍 RAG-lite with ChromaDB + sentence-transformers
- 📁 Project-based translation with editable sentences
- 🔐 Secure JWT-based auth using HTTP-only cookies
- 🖥️ React frontend with Tailwind, Redux, and intuitive UI

---

## 📦 Tech Stack

### Frontend (React)

- React + Vite
- Redux Toolkit
- React Router
- Tailwind CSS v4

### Backend (Node.js)

- Express
- JWT Auth with HTTP-only cookies
- Google OAuth login
- MongoDB (Mongoose)

### Translation Service (Flask)

- Flask
- llama-cpp-python
- sentence-transformers
- ChromaDB (RAG-lite)
- Python threading with job queue

---

## 🧪 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/translatex.git
cd translatex
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup (Node.js)

```bash
cd backend
npm install
npm run dev
```

> Configure `.env` for Mongo URI, JWT secrets, and Google OAuth credentials.

### 4. Flask Translation Service

```bash
cd translation-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Make sure to place your model in the `models/` directory.

### 🔗 Download Mistral Model

To run the Mistral-based translation locally, you need the quantized `.gguf` model file. You can download the recommended version here:

👉 [**Mistral-7B-Instruct-v0.1.Q4_K_M.gguf**](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf)

Once downloaded, place it in the `models/` folder in your Flask backend:

```bash
mkdir -p flask-api/models
mv mistral-7b-instruct-v0.1.Q4_K_M.gguf flask-api/models/
```

If you're using Docker, make sure your volume mounts the model correctly.

---

## 🐳 Docker (Optional)

Make sure Docker and Docker Compose are installed.

```bash
docker-compose up --build
```

## ✨ Credits

- Mistral-7B: [Mistral AI](https://mistral.ai)
- sentence-transformers: [UKPLab](https://www.sbert.net)
- ChromaDB: [trychroma.com](https://www.trychroma.com)

---

## 📬 License

MIT
