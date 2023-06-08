<script>
    import ContextCard from "./contextCard.svelte";
    import Answer from "./answer.svelte";
    import { functions } from "./firebase.js";
    import { httpsCallable } from "firebase/functions"
    import { top_k_contexts, build_prompt } from "./pinecone.js";

    let query = '';
    $: rows = query.split('\n').length + 1;
    let answer = '';
    let sentences = null;
    let message = '';
    let prompt = '';

    function checkForEnter(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // prevent newline from being entered
            ask_gpt(query);
        }
    }
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
        sentences = JSON.parse(reply);
        // join sentence texts with ' '
        sentences = sentences.map(s => ({...s, "context": contexts[s.context_idx]}));
        console.log('sentences', sentences);
        message = '';
        // return answer;
        // show reference cards
    }
</script>


<!-- textbox to ask a prompt with placeholder text 'ask a question' -->
<div id="qa-container">

<div class="textarea-container">
    <textarea rows={rows} id="user-input" placeholder="Enter your question..." bind:value={query} on:keydown={checkForEnter} on:mouseenter={e => {e.target.focus()}} on:mouseleave={e => {e.target.blur()}}></textarea>
    <div class="circle-btn" on:click={() => ask_gpt(query)}><div class="circle-btn-triangle"></div></div>
</div>

{#if message}
    <p><i>{message}</i></p>
{/if}

{#if sentences}
    <Answer sentences={sentences} />
{/if}

{#if sentences}
    <div id="reference-cards">
        {#each sentences as s}
            <ContextCard context_idx={s.context_idx} context={s.context} />
        {/each}
    </div>
{/if}

</div>



<style>
    .textarea-container {
        width: 100%;
        position: relative;
    }
    .circle-btn {
        position: absolute;
        width: 0px;
        height: 0px;
        right: 20px;
        bottom: 30px;
        border-radius: 50%;
        border: 30px solid green;
        cursor: pointer;
        filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5));
    }
    .circle-btn:hover {
        scale: 1.1;
    }
    .circle-btn-triangle {
        border-left: 30px solid white;
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        transform: translate(-10px, -50%);
    }

    #qa-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto; /* center the form */
        font-size: 2rem;
        gap: 3rem;
    }

    #user-input {
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: unset;
    }

    #qa-container button {
        width: 100%;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    #reference-cards {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
    }
</style>
