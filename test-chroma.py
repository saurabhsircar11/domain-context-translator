import chromadb

client = chromadb.HttpClient(host="localhost", port=8000)

collection = client.get_or_create_collection("test")

collection.add(
    documents=["Hello world"],
    metadatas=[{"type": "test"}],
    ids=["doc1"]
)

result = collection.query(
    query_texts=["Hello"],
    n_results=1
)

print(result)
