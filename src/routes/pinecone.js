import {multiply} from 'mathjs';
import {get} from 'svelte/store'
import {sources} from "./stores.js";

// take a matrix m and a vector v
// take the product Mv and return the argmax of the result


function top_k(m, v, k) {
    // returns the indices of the top k elements of the product Mv
    // i.e. the indicies with the greatest dot product with v
    const result = multiply(m, v);
    return result.map((x, i) => [x, i]).sort((a, b) => b[0] - a[0]).slice(0, k).map(x => x[1]);
}

export function top_k_contexts(query_vector, k = 2) {
    // returns the indices of the top k contexts for the query vector
    const sources_snapshot = get(sources);
    console.log('sources_snapshot', sources_snapshot)
    const good_srcs = Object.entries(sources_snapshot)
        .map(([key, value]) => ({...value, sourceId: key}))
        .filter(src => src.enabled && src.chunks && src.vectors && src.chunks.length === src.vectors.length)
    console.log('good_srcs', good_srcs)
    const source_ids = good_srcs.reduce((acc, src) => {
        let ids = new Array(src.chunks.length).fill(src.sourceId);
        return acc.concat(ids);
    }, []);
    console.log('source_ids', source_ids)
    const chunks = good_srcs.reduce((acc, src) => acc.concat(src.chunks), []);
    console.log('chunks', chunks)
    const vectors = good_srcs.reduce((acc, src) => acc.concat(src.vectors), []);
    console.log('vectors', vectors)
    const top_k_idxs = top_k(vectors, query_vector, k);
    console.log('top_k_idxs', top_k_idxs)
    const contexts_w_metadata = top_k_idxs.map(idx => ({
            source_id: source_ids[idx],
            source: sources_snapshot[source_ids[idx]],
            text: chunks[idx]
        })
    );
    console.log('contexts_w_metadata', contexts_w_metadata)

    return contexts_w_metadata;
}

export function build_prompt(contexts, query) {
    // contexts is an array of objects with the following keys
    // sourceId, sourceName, chunk, chunkId, chunkName, chunkType, chunkUrl, chunkText
    // query is a string
    let prompt = '' +
        ' Use the provided sources to answer following graduate open-ended exam question. Use the sources to answer the question.' +
        ' When you quote be sure to use quotation marks and make it clear whether you are quoting the article directly or a person who was quoted in the source. ' +
        ' Think about why each source might be relevant and try to incorporate each one if it is relevant.' +
        ' Quote liberally, but don\'t just regurgitate the source. You still have to use quotation marks and explain your own thinking and how the source answers the question. ' +
        ' \n' +
        ' Give your reply as a list of sentences in JSON format. Each sentence is an object with the following keys:' +
        ' "context_idx", "text", "youtube", and (optionally) "timestamp". The "context_idx" is the id of the chunk that provided the information' +
        ' for the sentence. The "text" is the text of the sentence. "youtube" is a boolean indicating whether the source is a youtube video. The "timestamp" MUST be included if the source is a youtube video.' +
        ' For these videos you MUST refer to the transcript and provide the timestamp of the quote or info you used in the sentence. ' +
        ' The "timestamp" is the number of seconds into the video where the sentence occurs. The first column of the transcript shows the timestamps. ' +
        ' If the source is not a youtube video then the "timestamp" field should be omitted. ' +
        ' A chunk can be used zero times or multiple times. ' +
        ' For example: ' +
        ' [{"context_idx": 3, "text": "The sky is blue.", "youtube": false}, {"context_idx": 1, "text": "This is because of atmospheric refraction.", "youtube": true, "timestamp": 10}]' +
        ' \n\n';
    prompt = prompt + 'Question: ' + query + '\n\n';
    prompt = prompt + 'Your sources are provided below. For each source, the source\'s metadata is provided, followed by the content. \n\n';
    contexts.forEach((context, context_idx) => {
        prompt = prompt + `Url: ${context.source.url}\n`;
        prompt = prompt + `Title: ${context.source.title}\n`;
        prompt = prompt + `Type: ${context.source.type}\n`;
        prompt = prompt + `context_idx: ${context_idx}\n`;
        prompt = prompt + context.text + '\n\n';
    });
    // iterate thru contexts printing the idx in the list followed by the context
    // const prompt = contexts.reduce((acc, context) => acc + '\n\ncontext: ' + context.chunk, '');
    return prompt
}