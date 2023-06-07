<script>
    import { db } from "./firebase.js";
    import Sources from './sources.svelte';
    import QA from './qa.svelte';
</script>

<div class="container">
    <QA />
    <Sources />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>