<script>
    import ReferenceCard from "./referenceCard.svelte";
    import { functions } from "./firebase.js";
    import { httpsCallable } from "firebase/functions"
    import { top_k_contexts, build_prompt } from "./pinecone.js";

    let query;
    let answer = '';
    let message = '';
    let prompt = '';
    let references = [];

    async function ask_gpt(query) {
        if (!query) {
            return;
        }
        const vectorize_query = httpsCallable(functions, 'vectorize0query');
        message = 'Embedding query...';
        const result = await vectorize_query({query: query});
        const vector = await result.data.vector;
        console.log('query vector', vector);
        message = 'Selecting context... Building prompt...';
        const contexts = top_k_contexts(vector, 2);
        prompt = build_prompt(contexts, query);
        console.log('prompt', prompt)
        const ask_prompt = httpsCallable(functions, 'ask0prompt');
        message = 'Asking GPT...';
        const response = await ask_prompt({prompt: prompt});
        const reply = await response.data.answer;
        console.log('I hope this reply is valid json ', reply);
        // parse reply as json
        const sentences = JSON.parse(reply);
        // join sentence texts with ' '
        references = sentences.map(s => contexts[s.context_idx]);
        console.log('references', references)
        answer = sentences.map(s => s.text).join(' ');
        message = 'answer received!'
        console.log('answer', answer)
        // return answer;
        // show reference cards
    }
</script>


<!-- textbox to ask a prompt with placeholder text 'ask a question' -->

<form id="chatbot-form">
    <textarea id="user-input" placeholder="Enter your question..." bind:value={query}></textarea>
    <button type="submit" on:click={() => ask_gpt(query)}>Submit</button>
    {#if message}
        <p><i>{message}</i></p>
    {/if}
    <div class="answer-box">
        {@html answer}
    </div>
</form>



<style>
    #chatbot-form {
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto; /* center the form */
        font-size: 2rem;
    }

    #user-input {
        width: 100%;
        height: 100px;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: vertical;
    }

    #chatbot-form button {
        width: 100%;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    #chatbot-form button:hover {
        background-color: #45a049;
    }
    .answer-box {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>
