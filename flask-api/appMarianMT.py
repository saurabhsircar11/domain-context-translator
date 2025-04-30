import sys
import json
from flask import Flask, request, jsonify
from transformers import MarianMTModel, MarianTokenizer

app = Flask(__name__)

model_cache ={}


def load_model(source_lang, target_lang):
    model_name = f'Helsinki-NLP/opus-mt-{source_lang}-{target_lang}'

    if model_name not in model_cache:
        print(f"Loading model: {model_name}")
        tokenzier= MarianTokenizer.from_pretrained(model_name)
        model= MarianMTModel.from_pretrained(model_name)
        model_cache[model_name]= (model, tokenzier)
    else:
        model, tokenzier = model_cache[model_name]

    return model , tokenzier

def translate(texts, source_lang='en', target_lang='de', context = 'IT system message:'):
    model, tokenzier = load_model(source_lang, target_lang)
    context_texts=[context+' ' + element for element in texts]
    inputs = tokenzier(context_texts, return_tensors='pt', padding= True, truncation = True)
    translated = model.generate(**inputs)

    translated_texts=[tokenzier.decode(t, skip_special_tokens= True) for t in translated] 
    return translated_texts

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.json
    texts = data.get('texts',[])
    source_lang = data.get('source_lang', 'en')
    target_lang= data.get('target_lang', 'de')
    context = data.get('context', 'IT system message:')
    translations = translate(texts, source_lang, target_lang, context)

    return jsonify({'translations': translations})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 5000)