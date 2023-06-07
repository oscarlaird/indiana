import { multiply } from 'mathjs';
import { get } from 'svelte/store'
import { sources } from "./firebase.js";

// take a matrix m and a vector v
// take the product Mv and return the argmax of the result


function top_k(m, v, k) {
    // returns the indices of the top k elements of the product Mv
    // i.e. the indicies with the greatest dot product with v
    const result = multiply(m, v);
    return result.map((x,i) => [x,i]).sort((a, b) => b[0] - a[0]).slice(0, k).map(x => x[1]);
}

export function top_k_contexts(query_vector, k=2) {
    // returns the indices of the top k contexts for the query vector
    const sources_snapshot = get(sources);
    console.log('sources_snapshot', sources_snapshot)
    const good_srcs = Object.entries(sources_snapshot)
        .map(([key, value]) => ({...value, sourceId: key}))
        .filter(src => src.enabled && src.chunks && src.vectors && src.chunks.length===src.vectors.length)
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
   const contexts_w_metadata = top_k_idxs.map(idx => ({...sources_snapshot[source_ids[idx]],
       chunks: null,
       vectors: null,
       fullcontent: null,
       chunk: chunks[idx]}));
    console.log('contexts_w_metadata', contexts_w_metadata)

   return contexts_w_metadata;
}

export function build_prompt(contexts, query) {
    // contexts is an array of objects with the following keys
    // sourceId, sourceName, chunk, chunkId, chunkName, chunkType, chunkUrl, chunkText
    // query is a string
    let prompt = 'You are a seasoned researcher. Answer the following question using the information below.' +
        'Only use the provided sources. Do not rely on your own opinions. Quote directly from the sources' +
        'As often as possible in order to answer the questions. Think about why each source is relevant.' +
        'Give your reply as html and make every quote a hyperlink to the source using the provided url for ' +
        'that source.\n\n';
    prompt = prompt + 'Question: ' + query + '\n\n';
    prompt = prompt + 'Sources:\n\n';
    contexts.forEach(context => {
        prompt = prompt + `Url: ${context.url}\n`;
        prompt = prompt + `Title: ${context.title}\n`;
        prompt = prompt + context.chunk + '\n\n';
    });
    // const prompt = contexts.reduce((acc, context) => acc + '\n\ncontext: ' + context.chunk, '');
    return prompt
}