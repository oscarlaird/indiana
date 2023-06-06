# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from typing import Any
import time
# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import db_fn  # , https_fn
# The Firebase Admin SDK to access the Firebase Realtime Database.
from firebase_admin import initialize_app, db

from pf.scrape import hi
from pf import ingest
from pf import gpt
from pf import secrets


app = initialize_app()


@db_fn.on_value_created(reference="/sources/{srcId}/fullcontent")
def embed0content(event: db_fn.Event[Any]) -> None:
    # get the reference of the new content
    ref = db.reference(event.reference).parent
    ref.child('status').set('chunking')
    chunks = ingest.chunk(event.data)
    ref.child('chunks').set(chunks)
    ref.child('status').set('embedding')
    gpt.authenticate(secrets.openai.org_id, secrets.openai.api_key)
    vectors = gpt.embed_texts(chunks)
    ref.child('vectors').set(vectors)
    ref.child('status').set('ready')
    ref.child('enabled').set(True)


# when a new url is added to sources set the status to 'parsing'
@db_fn.on_value_created(reference="/sources/{srcId}/status")
def parse0url(event: db_fn.Event[Any]) -> None:
    # get the reference of the new url
    if event.data != 'new':
        return

    print('Hello Logs!!!', event.params['srcId'])

    ref = db.reference(event.reference)

    ref.set('parsing')
    # parse event.params['srcId'] and decode URI component
    url = ref.parent.child('url').get()

    metadata = ingest.parse_src(url)  # type, title, published, full_content
    for key, value in metadata.items():
        ref.parent.child(key).set(value)
    ref.set('parsed')

# the function parse0url can be deployed by itself with the following command
# firebase deploy --only functions:parse0url

# you can delete it with
# firebase functions:delete parse0url
