<script>
    import { db } from "./firebase.js";
    import Sources from './sources.svelte';
    let query;
    let answer;
</script>

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