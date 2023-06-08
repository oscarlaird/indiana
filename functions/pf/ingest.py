# INGEST
# Download resource from link
# Transcribe the video / download the article
# Chunk it
# Embed
# Insert into pinecone db

from typing import List

import yt_dlp as youtube_dl
from youtube_transcript_api import YouTubeTranscriptApi
from newspaper import Article
from datetime import datetime

import logging


class ParseError(Exception):
    pass


def get_type(url: str):
    if 'youtube' in url:
        return 'youtube'
    elif any(site in url for site in
             ['nationalreview', 'nytimes', 'washingtonpost', 'wsj', 'bloomberg', 'reuters', 'apnews']):
        return 'article'
    # social media
    elif any(site in url for site in ['twitter', 'facebook', 'linkedin', 'reddit']):
        return 'social'
    else:
        return 'article'


def parse_src(url: str):
    type = get_type(url)
    if type == 'youtube':
        return parse_youtube(url)
    elif type == 'article':
        return parse_article(url)
    else:
        raise ParseError('No ingestion method for source type ', type)


def parse_article(url):
    # fetch the content
    # set the metadata
    # chunk the text and embed it
    metadata = {'type': 'article'}

    article = Article(url)
    article.download()
    article.parse()

    metadata['title'] = article.title
    if article.publish_date:
        metadata['published'] = datetime.strftime(article.publish_date, '%Y-%m-%d')  # format to YYYY-MM-DD
    metadata['fullcontent'] = article.text
    metadata['favicon'] = article.meta_favicon
    if not metadata['fullcontent']:
        raise ParseError('Could not extract content from article at ', url)

    return metadata


def parse_youtube(url):
    logging.info(f'Ingesting youtube video at {url}')
    logging.debug(f'Fetching metadata for youtube video at {url}')

    # we will build metadata
    metadata = {'type': 'youtube'}

    # Fetch the video metadata using youtube_dl
    ydl_opts = {}
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        video_info = ydl.extract_info(url, download=False,)
        title = video_info.get('title')
        date = video_info.get('upload_date')
        if date:
            date = datetime.strftime(datetime.strptime(date, '%Y%m%d'), '%Y-%m-%d')
        metadata['title'] = title
        metadata['published'] = date

    # Fetch the transcript of the video using YouTubeTranscriptApi
    video_id = url.split("v=")[1]
    transcript = YouTubeTranscriptApi.get_transcript(video_id)

    # Chunk the transcript
    text = '\n'.join(str(int(bit['start'])) + ' ' + bit['text'] for bit in transcript)
    metadata['fullcontent'] = text

    # Fetch the thumbnail
    metadata['favicon'] = "./favicons/youtube.png"

    return metadata

# chunk the content into ~200 word chunks of 1000 chars
# try to break on sentences
def chunk(content, max_chars=1000):
    chunks = []
    while content:
        # find the last period before the max_chunk-th character
        max_chunk = content[:max_chars]
        last_period = max(max_chunk.rfind('.'), max_chunk.rfind('!'), max_chunk.rfind('?'))
        # if there is no period, just break at 500
        if last_period == -1:
            last_period = 1000
        new_chunk, content = content[:last_period + 1], content[last_period + 1:]
        chunks.append(new_chunk)
    return chunks


'''
# take a youtube video and return a transcript of it with timestamps
def transcribe(youtube_video) -> List[str]:
    pass
    # dl = youtube-dl
    # src.title, src.date = dl....
    # mp4 = dl....
    # chunks = mp4.split(...
    # texts = transcribe(chunks)
'''
