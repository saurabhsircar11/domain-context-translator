from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
import threading
import queue
import atexit


from rag_utils import RAGRetriever

retriever = RAGRetriever(collection_name="ui_phrases")
# ------------------------------
# Model Setup
# ------------------------------
MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
NUM_WORKERS = 2

llm = Llama(
    model_path=MODEL_PATH,
    n_threads=4,
    n_ctx=2048,
    temperature=0.1,     # Lowered from 0.7 → makes responses more focused and stable
    top_p=0.85,           # Slightly narrowed sampling window
    repeat_penalty=1.1   # You can keep this; it discourages repetitive phrasing
)

job_queue = queue.Queue()

def translate_prompt(text, source_lang, target_lang, domain):
    domain = domain.lower()
    lang_map = {
        "english": "en",
        "french": "fr",
        "spanish": "es",
        "german": "de",
        "italian": "it"
    }

    target_code = lang_map.get(target_lang.lower())
    if not target_code:
        return f"[INST] ERROR: Unsupported target language '{target_lang}' [/INST]"

    # 🔍 RAG: Retrieve similar phrases
    retrieved = retriever.get_similar_examples(text, domain=domain, target_lang=target_code, top_k=3)

    few_shot_lines = []
    for phrase, translation in retrieved:
        few_shot_lines.append(f"{phrase} → {translation}")

    prompt = (
        f"[INST] You are a professional translator specialized in the {domain} domain.\n"
        f"Your task is to translate short UI phrases from {source_lang} to {target_lang}.\n"
        f"Use clear, user-friendly language appropriate for a {domain} context.\n"
        f"Only return the translated phrase — do not explain.\n"
    )

    if few_shot_lines:
        prompt += "\nHere are some examples:\n"
        prompt += "\n".join(few_shot_lines)

    prompt += f"\n\nNow translate:\n{text} [/INST]"

    # Debug output
    print("\n=== Generated Prompt ===\n")
    print(prompt)
    print("\n========================\n")

    return prompt

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
