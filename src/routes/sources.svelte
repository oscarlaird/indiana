<script>
    // import realtime database functions from firebase
    import { push, ref, remove, set } from "firebase/database";
    import { db } from "./firebase.js";
    import { sources } from "./stores.js";
    import Source from "./source.svelte";


    let new_url;

    // example of top_k

    const addSource = async (url) => {
        // if the url is not null add it to the sources
        if (url) {
            const sources_ref = ref(db, "sources/");
            let unixTimestamp = Math.floor(Date.now() / 1000);
            push(sources_ref, {
                "url": url,
                "status": "new",
                "unix_time_added": unixTimestamp
            }).then(r => console.log('added source ' + url)).catch(e => console.log(e));
        }
        new_url = "";
    }

    const deleteSource = async (srcId) => {
        const source_ref = ref(db, "sources/" + srcId);
        remove(source_ref);
    }

    // async function setEnabled(srcId, value) {
        // const source_ref = ref(db, "sources/" + srcId + "/enabled")
        // set(source_ref, value);
    // }

    $: console.log('sources', $sources);

</script>

<div class="sources-header">
<div class="sources-title">Sources</div>
<!-- create a button to add a new source specifying the url thru input -->
<form on:submit|preventDefault={() => addSource(new_url)}>
    <input type="text" placeholder="Enter a URL..." bind:value={new_url}>
    <button type="submit">Add Source</button>
</form>
</div>
<!-- iterate over the sources in order of addition using the sourceId as key -->
<div class="sources-list">
    {#each Object.entries($sources).sort((a, b) => b[1].unix_time_added - a[1].unix_time_added) as pair (pair[0])}
        <Source source={pair[1]} on:delete={() => deleteSource(pair[0])} />
    {/each}
</div>

<style>
    .sources-header {
        /* center the header */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* add a gap between the header and the sources */
        margin-bottom: 10px;
    }
    .sources-header .sources-title {
        /* make the title large */
        font-size: 50px;
    }
    .sources-header input[type=text] {
        /* make the input box large */
        font-size: 30px;
        margin: 10px;
    }
    .sources-header button {
        /* make the button large */
        font-size: 30px;
    }
    .sources-list {
        width: 100%;
        /* show the sources in a two column grid */
        display: grid;
        grid-template-columns: 1fr 1fr;
        /* add a gap between the sources */
        gap: 20px;


    }
</style>