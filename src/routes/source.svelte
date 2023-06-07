<script>
    // A simple component showing a source's url/title, status, and a button to remove it
    export let source;
    import { createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div class="source">
<h2>
    <!-- show the article's favicon -->
    <img src={source.favicon} alt={source.title} width="32" height="32"/>
    <a href={source.url}>{source.title || source.url}</a>
</h2>
<label>
    <input type="checkbox" checked={source.enabled} on:click={e => dispatch('setEnabled', e.target.checked)}/>
    {source.enabled ? 'Enabled' : 'Disabled'}
</label>
<label>
    <button on:click={e => dispatch('delete', e)}>x</button>
    Delete
</label>
{source.status}
</div>

<style>
    .source {
        width: 100%;
        border: 1px solid black;
        padding: 1em;
    }
    .source h2 {
        margin: 0;
    }
    .source label {
        display: block;
    }
    .source label input {
        margin-right: 1em;
    }
    .source label button {
        margin-right: 1em;
    }
</style>
