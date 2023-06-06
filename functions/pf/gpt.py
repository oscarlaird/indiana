"""
Create embeddings for texts using the OpenAI API and store them in Pinecone's Vector Database
Also expose other OpenAI API functionality
"""

import random
import string
from typing import List

import openai
# use a .env file for keys
import os

import logging

def authenticate(openai_org_id, openai_api_key):
    openai.organization = openai_org_id
    openai.api_key = openai_api_key

def embed_texts(texts) -> List[List[float]]:
    """Embed a list of texts using the OpenAI API"""
    response = openai.Embedding.create(
        model="text-embedding-ada-002",
        input=texts
    )
    embeddings = [data['embedding'] for data in response['data']]
    return embeddings

def embed_text(text) -> List[float]:
    """Embed a single text using the OpenAI API"""
    return embed_texts([text])[0]

def ask_prompt(prompt) -> str:
    completion = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return completion.choices[0].message['content']

# def add_vectors(vectors, metadata):
# pass
