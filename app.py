from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os
import fitz  # PyMuPDF
from pymongo import MongoClient
import google.generativeai as genai

# Set your Google Cloud API key
genai.configure(api_key="AIzaSyCtBSlxpSniKO7h4xDsSblEXk9-gWL549M")

# MongoDB connection settings
MONGO_URI = "mongodb+srv://kamalnayanchivukula:Premakanth%40123@database.ca2mjix.mongodb.net/" # Replace with your MongoDB connection URI
DATABASE_NAME = "Text_SSummeriser"   # Replace with your database name
COLLECTION_NAME = "rag"  # Replace with your collection name

app = Flask(__name__)
CORS(app) # Enable CORS for cross-origin requests

# Create the model
# See https://ai.google.dev/api/python/google/generativeai/GenerativeModel
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

# Create a separate instance of the SentenceTransformer model for encoding text
embedding_model = SentenceTransformer('all-mpnet-base-v2') 

gemini_model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config,
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

# Initialize the chat session
chat_session = gemini_model.start_chat(
  history=[
  ]
)

def extract_text_from_pdf(pdf_path, chunk_size=512):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
    return chunks

def get_embeddings(chunks, model):
    embeddings = model.encode(chunks, convert_to_tensor=True)
    return embeddings, model

def build_faiss_index(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

def search_similar_chunks(query, faiss_index, embedding_model, chunks, top_k=5):
    query_embedding = embedding_model.encode([query], convert_to_tensor=True)
    distances, indices = faiss_index.search(query_embedding, top_k)
    results = [chunks[i] for i in indices[0]]
    return results

def generate_answer(prompt, chat_session):
    # Send the prompt to the chat session
    response = chat_session.send_message(prompt)
    return response.text

def retrieve_embeddings_from_mongodb():
    """Retrieves embeddings and chunks from MongoDB.
    """
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    all_embeddings = []
    all_chunks = []
    for doc in collection.find():
        all_embeddings.append(np.array(doc["embedding"]))
        all_chunks.append(doc["chunk"])

    return all_embeddings, all_chunks

# extracting the pdfs and embeddig them and stroing it into the mongodb
def process_pdfs_and_get_embeddings(pdf_folder):
    all_embeddings = []
    all_chunks = []
    for filename in os.listdir(pdf_folder):
        if filename.endswith('.pdf'):
            pdf_path = os.path.join(pdf_folder, filename)
            chunks = extract_text_from_pdf(pdf_path)
            chunk_embeddings, _ = get_embeddings(chunks, embedding_model) 

            all_embeddings.extend(chunk_embeddings)
            all_chunks.extend(chunks)

    return all_embeddings, all_chunks

def store_embeddings_in_mongodb(embeddings, chunks):
    client = MongoClient(MONGO_URI)
    db = client[DATABASE_NAME]
    collection = db[COLLECTION_NAME]

    for i, embedding in enumerate(embeddings):
        embedding_data = {
            "chunk": chunks[i],  # Store the chunk of text
            "embedding": embedding.tolist()  # Convert NumPy array to list for MongoDB
        }
        collection.insert_one(embedding_data)
    print("Stored Successfully")

def query_and_search(query):
    """Performs a search based on a user query and returns the answer.
    """
    all_embeddings, all_chunks = retrieve_embeddings_from_mongodb()
    faiss_index = build_faiss_index(np.array(all_embeddings))
    similar_chunks = search_similar_chunks(query, faiss_index, embedding_model, all_chunks)
    context = "\n\n".join(similar_chunks)
    prompt = f"Based on the following context, answer the query:\n\nContext:\n{context}\n\nQuery:\n{query}"
    answer = generate_answer(prompt, chat_session)
    return answer

@app.route('/process_pdf', methods=['POST'])
def process_pdf():
    try:
        pdf_folder = request.json['pdf_folder']
        all_embeddings, all_chunks = process_pdfs_and_get_embeddings(pdf_folder)
        store_embeddings_in_mongodb(all_embeddings, all_chunks)
        return jsonify({'message': 'PDFs processed and embeddings stored'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/search', methods=['POST'])
def search():
    try:
        query = request.json['query']
        answer = query_and_search(query)
        return jsonify({'answer': answer}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)