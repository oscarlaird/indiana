<script>
    import { selected_context_idx } from "./stores.js";
    import ArticleContext from "./context_cards/article_context.svelte";
    import YoutubeContext from "./context_cards/youtube_context.svelte";
    import TwitterContext from "./context_cards/twitter_context.svelte";

    export let context; // a source object also including the specific chunk text
    export let context_idx;
</script>

<!-- the reference card has a yellow glow when the context is selected -->
<div class="context-card-container"
     class:glow={$selected_context_idx === context_idx}
     on:mouseenter={() => selected_context_idx.set(context_idx)}
     on:mouseleave={() => selected_context_idx.set(null)}
     >

    {#if context.source.type === "article"}
        <ArticleContext {context} />
    {:else if context.source.type === "youtube"}
        <YoutubeContext {context} />
    {:else if context.source.type === "twitter"}
        <TwitterContext {context} />
    {:else}
        <p>Unknown context type: {context.source.type}</p>
    {/if}
</div>

<style>
    .context-card-container {
        width: 800px;
        height: 800px;
        background-color: #fff;
        border-radius: 4px;
        /* big box shadow */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        padding: 16px;
        margin-bottom: 16px;
        border: 2px solid black;
        /* shadow
         */
    }
    .glow {
        border: 2px solid yellow;
        scale: 1.1;
    }
    .context-card-container:hover {
    }
</style>