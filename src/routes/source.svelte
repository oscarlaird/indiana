<script>
    // A simple component showing a source's url/title, status, and a button to remove it
    export let source;
    import { createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    import Trashcan from "./trashcan.svelte";
    // yellow if "parsing" or "embedding", otherwise red
    $: status_color = source.status === "parsing" || source.status === "embedding" || source.status === "new" ? "green" : "red";
    $: status_text = source.status === "parsing" ? "parsing..." : source.status === "embedding" ? "embedding..." : source.status === "ready" ? "" : source.status;
    $: default_favicon = source.favicon || (source.status === "parsing" || source.status === "embedding" || source.status === "new" ? "./favicons/loading.png" : "./favicons/error.png");
</script>

<div class="source">
    <!-- show the article's favicon -->
    <div class="trashcan-box">
        <Trashcan on:click={() => dispatch("delete", source)} />
    </div>

    <a href={source.url} target="_blank" rel="noopener noreferrer">
        <img src={source.favicon || default_favicon} alt={source.title} on:error={e => {e.target.src="./favicons/ready.png"}} />
    </a>

    <div class="title-box">
        <span style:color={status_color}>
        {status_text}
        </span>
    <a href={source.url} target="_blank" rel="noopener noreferrer" >{source.title || source.url}</a>
    </div>
</div>

<style>
    .source {
        background: white;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 30px;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.5);
    }
    .source:hover {
        scale: 1.1;
        border: 1px solid black;
    }
    img {
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        margin: 0 20px 0 0;
        cursor: pointer;
        background: white;
    }
    img:hover{
        scale: 1.2;
    }
    .trashcan-box {
        flex: 0 0 60px;
    }
</style>
