<script>
    import { functions } from "./firebase.js";
    import { httpsCallable } from "firebase/functions"
    import { top_k_contexts, build_prompt } from "./pinecone.js";

    let query;
    let answer = 'a1';
    let message = '';
    let prompt = '';

    async function ask_gpt(query) {
        const vectorize_query = httpsCallable(functions, 'vectorize0query');
        message = 'Embedding query...';
        const result = await vectorize_query({query: query});
        const vector = await result.data.vector;
        console.log('query vector', vector);
        message = 'Selecting context... Building prompt...';
        const contexts = top_k_contexts(vector, 2);
        prompt = build_prompt(contexts, query);
        const ask_prompt = httpsCallable(functions, 'ask0prompt');
        message = 'Asking GPT...';
        const response = await ask_prompt({prompt: prompt});
        answer = await response.data.answer;
        message = 'answer received!'
        console.log('answer', answer)
        return answer
        // show reference cards
    }
</script>


Question
<!-- textbox to ask a prompt with placeholder text 'ask a question' -->
<br>
<textarea rows="4" cols="50" placeholder="Ask a question..." bind:value={query}></textarea>
<button on:click={async () => answer = await ask_gpt(query)}>Ask</button>
<hr>
Message <br>
{message}
<hr>
Answer <br>
{@html answer}
<hr>
Prompt <br>
<!-- show the prompt as html -->
{@html prompt}



