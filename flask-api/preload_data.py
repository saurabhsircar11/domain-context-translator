from rag_utils import RAGRetriever
from domain_examples import domain_examples

def prepare_examples_for_embedding(domain_examples):
    examples = []
    for domain, phrase_list in domain_examples.items():
        for english_text, translations in phrase_list:
            for lang_code, translated_text in translations.items():
                examples.append({
                    "domain": domain,
                    "text": english_text,
                    "target_lang": lang_code,
                    "translation": translated_text
                })
    return examples

if __name__ == "__main__":
    retriever = RAGRetriever(collection_name="ui_phrases")
    examples = prepare_examples_for_embedding(domain_examples)
    retriever.add_examples(examples)
    print(f"✅ Loaded {len(examples)} examples into ChromaDB.")
