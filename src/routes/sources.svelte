<script>
    // import realtime database functions from firebase
    import { set } from "firebase/database";
    import {db} from "./firebase.js";
    // Simple table showing all the sources
    const example_sources = {
        "https://www.youtube.com/watch?v=9bZkp7q19f0": {title: "PSY - GANGNAM STYLE(강남스타일) M/V"},
    }
    export let sources = example_sources;
    // a function to create a new source in the firestore

    export const addSource = async (url) => {
        const ref = db.ref("sources/" + url);
        await ref.set({})
    }

    export const deleteSource = async (url) => {
        const ref = db.ref("sources/" + url);
        await ref.remove();
    }
    import { onMount} from "svelte";
    console.log('here')
    onMount(async () => {
        prompt('onMount')
    });

</script>

<!-- create a button to add a new source specifying the url thru input -->
<!-- <button on:click={() => addSource(prompt("Enter a URL..."))}>Add Source</button> -->

<!-- create a table with all the sources -->
<table class="table table-striped">
    <thead>
        <tr>
            <th>URL</th>
            <th>Title</th>
            <th>Enabled</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.entries(sources) as [url, source]}
            <tr>
                <td>url</td>
                <td>{source.title}</td>
                <!-- a checkbox bound to the enabled attribute -->
                 <td><input type="checkbox" bind:checked={source.enabled} /></td>

            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        width: 100%;
    }
    .table-striped tbody tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.05);
    }
</style>

{JSON.stringify(sources)}