<script>
    import { db } from "./firebase.js";
    import { docStore } from "sveltefire";
    import Sources from './sources.svelte';
    let query;
    let answer;
    const post = docStore(db, 'sources/1');
</script>

<h1>{$post}</h1>
Question
<!-- textbox to ask a prompt with placeholder text 'ask a question' -->
<br>
<textarea rows="4" cols="50" placeholder="Ask a question..." bind:value={query}></textarea>
{query}
<hr>
Answer
<hr>
Sources:
<br>
<Sources />