import os
from sentence_transformers import SentenceTransformer
import chromadb

class RAGRetriever:
    def __init__(self, collection_name="ui_phrases"):
        host = os.getenv("CHROMA_HOST", "localhost")
        port = int(os.getenv("CHROMA_PORT", "8000"))

        # ✅ Correct usage of HttpClient
        self.client = chromadb.HttpClient(host=host, port=port)
        self.collection = self.client.get_or_create_collection(name=collection_name)
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed(self, text):
        return self.model.encode(text).tolist()

    def add_examples(self, examples):
        for idx, example in enumerate(examples):
            text = example["text"]
            emb = self.embed(text)
            doc_id = f"{example['domain']}_{example['target_lang']}_{text.replace(' ', '_')}_{idx}"
            self.collection.add(
                documents=[text],
                metadatas=[{
                    "domain": example["domain"],
                    "target_lang": example["target_lang"],
                    "translation": example["translation"]
                }],
                ids=[doc_id],
                embeddings=[emb]
            )

    def get_similar_examples(self, query_text, domain=None, target_lang=None, top_k=3):
        emb = self.embed(query_text)
        filters = {}
        filters = {}
        if domain and target_lang:
            filters = {
                "$and": [
                    {"domain": domain},
                    {"target_lang": target_lang}
                ]
            }
        elif domain:
            filters = {"domain": domain}
        elif target_lang:
            filters = {"target_lang": target_lang}
        results = self.collection.query(
            query_embeddings=[emb],
            n_results=top_k,
            where=filters
        )

        examples = []
        for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
            examples.append((doc, meta["translation"]))

        return examples
