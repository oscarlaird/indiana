<script>
    // import realtime database functions from firebase
    import { set, ref, remove } from "firebase/database";
    import { db, sources } from "./firebase.js";

    const addSource = async (url) => {
        // if the url is not null add it to the sources
        if (url) {
            const source_ref = ref(db, "sources/" + encodeURIComponent(url))
            set(source_ref, {enabled: true});
        }
    }

    const deleteSource = async (url) => {
        const source_ref = ref(db, "sources/" + encodeURIComponent(url))
        remove(source_ref);
    }
    async function setEnabled(url, value) {
        const source_ref = ref(db, "sources/" + encodeURIComponent(url) + "/enabled")
        set(source_ref, value);
    }

</script>

<!-- create a button to add a new source specifying the url thru input -->
<button on:click={() => addSource(prompt("Enter a URL..."))}>Add Source</button>

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
        {#each Object.entries($sources) as pair}
            <tr>
                <!-- x mark to remove a source -->
                <td><button on:click={() => deleteSource(pair[0])}>✕</button></td>
                <td>{pair[0]}</td>
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