<script>
    import { db } from "./firebase.js";
    import Sources from './sources.svelte';
    import QA from './qa.svelte';
</script>

<div class="container">
    <h1>Indiana Research</h1>
    <hr>
    <QA />
    <hr>
    <Sources />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 2000px;
        margin: 100px auto;
    }
    hr {
        width: 100%;
        margin: 1rem 0;
    }
    h1 {
        font-size: 3rem;
        margin: 0;
    }
</style>