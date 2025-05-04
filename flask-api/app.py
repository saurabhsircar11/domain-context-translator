from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import threading
import queue
import atexit

# ------------------------------
# Model Setup
# ------------------------------
MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
NUM_WORKERS = 2

llm = Llama(
    model_path=MODEL_PATH,
    n_threads=4,
    n_ctx=2048,
    temperature=0.7,
    top_p=0.95,
    repeat_penalty=1.1
)

job_queue = queue.Queue()

def translate_prompt(text, source_lang, target_lang, domain):
    return (
        f"[INST] You are a translator specialized in {domain}. "
        f"Translate this sentence from {source_lang} to {target_lang}:\n"
        f"{text} [/INST]"
    )

def inference_worker():
    while True:
        job = job_queue.get()
        if job is None:
            break
        text, source_lang, target_lang, domain, result_queue = job
        try:
            prompt = translate_prompt(text, source_lang, target_lang, domain)
            output = llm(prompt, max_tokens=256)
            response = output["choices"][0]["text"].strip()
            result_queue.put(response)
        except Exception as e:
            result_queue.put(f"Error: {str(e)}")

# Start workers
workers = []
for _ in range(NUM_WORKERS):
    t = threading.Thread(target=inference_worker, daemon=True)
    t.start()
    workers.append(t)

# ------------------------------
# Flask App
# ------------------------------
app = Flask(__name__)
CORS(app)

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json
    texts = data.get("texts")
    source = data.get("source_lang", "English")
    target = data.get("target_lang", "French")
    context = data.get("context", "general")

    if not texts or not isinstance(texts, list):
        return jsonify({"error": "Provide a list of 'texts'"}), 400

    results = []
    for text in texts:
        result_queue = queue.Queue()
        job_queue.put((text, source, target, context, result_queue))
        try:
            translated = result_queue.get(timeout=60)
        except Exception as e:
            translated = f"Error: {str(e)}"
        results.append({
            "input": text,
            "translated": translated,
            "source_lang": source,
            "target_lang": target
        })

    return jsonify({"results": results})

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"})

@atexit.register
def shutdown():
    for _ in workers:
        job_queue.put(None)
    for t in workers:
        t.join()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
