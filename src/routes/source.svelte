<script>
    // A simple component showing a source's url/title, status, and a button to remove it
    export let source;
    import { createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    import Trashcan from "./trashcan.svelte";
</script>

<div class="source">
    <!-- show the article's favicon -->
    <div class="trashcan-box">
        <Trashcan on:click={() => dispatch("delete", source)} />
    </div>

    <a href={source.url} target="_blank" rel="noopener noreferrer">
        <img src={source.favicon || "./favicon.png"} alt={source.title} on:error={e => {e.target.src="./favicon.png"}} />
    </a>

    <div class="title-box">
        ({source.status})
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
    }
    img:hover{
        scale: 1.2;
    }
    .trashcan-box {
        flex: 0 0 60px;
    }
</style>
