<script>
    // import realtime database functions from firebase
    import { set, ref, remove, push } from "firebase/database";
    import { db, sources } from "./firebase.js";
    import { top_k } from "./pinecone.js";

    // example of top_k
    console.log(top_k([[1, 2],[3,4]],[2,-10], 1));

    const addSource = async (url) => {
        // if the url is not null add it to the sources
        if (url) {
            const sources_ref = ref(db, "sources/");
            push(sources_ref, {"url": url, "status": "new"}).then(r => console.log('added source ' + url)).catch(e => console.log(e));
        }
    }

    const deleteSource = async (srcId) => {
        const source_ref = ref(db, "sources/" + srcId);
        remove(source_ref);
    }
    async function setEnabled(srcId, value) {
        const source_ref = ref(db, "sources/" + srcId + "/enabled")
        set(source_ref, value);
    }
    $: console.log('sources', $sources);

</script>

<!-- create a button to add a new source specifying the url thru input -->
<button on:click={() => addSource(prompt("Enter a URL..."))}>Add Source</button>

<!-- create a table with all the sources -->
<table class="table table-striped">
    <thead>
        <tr>
            <th></th>
            <th>URL</th>
            <th>Title</th>
            <th>Enabled</th>
        </tr>
    </thead>
    <tbody>
        {#each Object.entries($sources) as pair (pair[0])} <!-- iterate over the sources -->
            <tr>
                <!-- x mark to remove a source -->
                <td><button on:click={() => deleteSource(pair[0])}>✕</button></td>
                <td>{pair[1].url}</td>
                <td>{pair[1].title}</td>
                <!-- a checkbox bound to the enabled attribute -->
                 <td><input type="checkbox" on:click={(event) => setEnabled(pair[0], event.target.checked)} bind:checked={pair[1].enabled}></td>

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

{JSON.stringify($sources)}