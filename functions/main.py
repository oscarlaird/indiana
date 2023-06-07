# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from typing import Any
import logging
import time
# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import db_fn, https_fn
# The Firebase Admin SDK to access the Firebase Realtime Database.
from firebase_admin import initialize_app, db

from pf.scrape import hi
from pf import ingest
from pf import gpt
from pf import secrets

app = initialize_app()


@https_fn.on_call()
def vectorize0query(req: https_fn.CallableRequest) -> Any:
    """Vectorize a query using the OpenAI API"""
    # get the query
    query = req.data['query']
    # vectorize the query
    vector = gpt.embed_text(query)
    # return the vector
    return {'vector': vector}


@https_fn.on_call(timeout_sec=300)
def ask0prompt(req: https_fn.CallableRequest) -> Any:
    """Ask a prompt using the OpenAI API"""
    # get the prompt
    prompt = req.data['prompt']
    # ask the prompt
    answer = gpt.ask_prompt(prompt)
    # return the response
    return {'answer': answer}


@db_fn.on_value_created(reference="/sources/{srcId}/fullcontent", timeout_sec=300)
def embed0content(event: db_fn.Event[Any]) -> None:
    # get the reference of the new content
    ref = db.reference(event.reference).parent
    ref.child('status').set('chunking')
    chunks = ingest.chunk(event.data)
    ref.child('chunks').set(chunks)
    ref.child('status').set('embedding')
    vectors = gpt.embed_texts(chunks)
    ref.child('vectors').set(vectors)
    ref.child('status').set('ready')
    ref.child('enabled').set(True)


# when a new url is added to sources set the status to 'parsing'
@db_fn.on_value_created(reference="/sources/{srcId}/url")
def parse0url(event: db_fn.Event[Any]) -> None:
    ref = db.reference(event.reference)
    # log the ref
    logging.error('bad ref ', repr(ref), 'ref parent ', repr(ref.parent))

    ref.parent.child('status').set('parsing')
    try:
        metadata = ingest.parse_src(url=event.data)  # type, title, published, full_content
        for key, value in metadata.items():
            ref.parent.child(key).set(value)
    except ingest.ParseError as e:
        logging.error(e)
        ref.parent.child('status').set('could not parse')

# the function parse0url can be deployed by itself with the following command
# firebase deploy --only functions:parse0url

# you can delete it with
# firebase functions:delete parse0url
