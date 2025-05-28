import json
import os
import random
import threading
import time
import atexit

import pika
from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama
from rag_utils import RAGRetriever

# ------------------------------
# Config
# ------------------------------
MODEL_PATH = "models/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
REQUEST_QUEUE = "translation_jobs"
RESULT_QUEUE_PREFIX = "result_"
NUM_WORKERS = 2

# ------------------------------
# Init
# ------------------------------
retriever = RAGRetriever(collection_name="ui_phrases")
llm = Llama(
    model_path=MODEL_PATH,
    n_threads=4,
    n_ctx=2048,
    temperature=0.1,
    top_p=0.85,
    repeat_penalty=1.1
)

connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
channel = connection.channel()
channel.queue_declare(queue=REQUEST_QUEUE, durable=True)

def translate_prompt(text, source_lang, target_lang, domain):
    domain = domain.lower()
    lang_map = {
        "english": "en", "french": "fr", "spanish": "es", "german": "de", "italian": "it"
    }
    target_code = lang_map.get(target_lang.lower())
    if not target_code:
        return f"[INST] ERROR: Unsupported target language '{target_lang}' [/INST]"

    retrieved = retriever.get_similar_examples(text, domain=domain, target_lang=target_code, top_k=3)
    few_shot_lines = [f"{phrase} → {translation}" for phrase, translation in retrieved]

    prompt = (
        f"[INST] You are a professional translator specialized in the {domain} domain.\n"
        f"Your task is to translate short UI phrases from {source_lang} to {target_lang}.\n"
        f"Use clear, user-friendly language appropriate for a {domain} context.\n"
        f"Only return the translated phrase — do not explain.\n"
    )

    if few_shot_lines:
        prompt += "\nHere are some examples to guide you:\n" + "\n".join(few_shot_lines)
    else:
        prompt += "\nNo prior examples are available — please rely on your domain knowledge."
    prompt += f"\n\nNow translate:\n{text} [/INST]"
    return prompt


def process_job(ch, method, properties, body):
    try:
        data = json.loads(body)
        job_id = data["jobId"]
        user_id = data.get("userId")             # New: must be included in the job message
        title = data.get("title")                 # New: from job message
        texts = data.get("texts", [])
        source_lang = data.get("source_lang", "English")
        target_lang = data.get("target_lang", "French")
        context = data.get("context", "general")

        results = []
        for text in texts:
            prompt = translate_prompt(text, source_lang, target_lang, context)
            output = llm(
                prompt,
                max_tokens=256,
                temperature=round(random.uniform(0.15, 0.35), 2),
                top_p=round(random.uniform(0.8, 0.95), 2),
                repeat_penalty=1.05 + random.uniform(0.0, 0.1),
            )
            translated = output["choices"][0]["text"].strip()
            results.append({"input": text, "translated": translated})

        # Compose unified result payload
        result_payload = json.dumps({
            "jobId": job_id,
            "userId": user_id,
            "title": title,
            "domain": context,
            "results": results,
        })

        # Publish to shared results queue
        RESULT_QUEUE = "translation_results"
        channel.queue_declare(queue=RESULT_QUEUE, durable=True)
        channel.basic_publish(
            exchange="",
            routing_key=RESULT_QUEUE,
            body=result_payload,
            properties=pika.BasicProperties(delivery_mode=2)
        )
        print(f"✅ Processed and published results for job {job_id}")
    except Exception as e:
        print(f"❌ Error processing job: {str(e)}")
    finally:
        ch.basic_ack(delivery_tag=method.delivery_tag)

def start_worker():
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=REQUEST_QUEUE, on_message_callback=process_job)
    print("🚀 Waiting for translation jobs...")
    channel.start_consuming()

# ------------------------------
# Flask App (Optional Health Check)
# ------------------------------
app = Flask(__name__)
CORS(app)

@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    threading.Thread(target=start_worker, daemon=True).start()
    app.run(host="0.0.0.0", port=5000)
