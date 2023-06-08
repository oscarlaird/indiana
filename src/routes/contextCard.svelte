<script>
    import { selected_context_idx } from "./stores.js";
    import ArticleContext from "./context_cards/article_context.svelte";
    import YoutubeContext from "./context_cards/youtube_context.svelte";
    import TwitterContext from "./context_cards/twitter_context.svelte";

    export let sentence; // a source object also including the specific chunk text
</script>

<!-- the reference card has a yellow glow when the context is selected -->
<div class="context-card-container"
     class:glow={$selected_context_idx === sentence.context_idx}
     on:mouseenter={() => selected_context_idx.set(sentence.context_idx)}
     on:mouseleave={() => selected_context_idx.set(null)}
     >

    {#if sentence.context.source.type === "article"}
        <ArticleContext {sentence} />
    {:else if sentence.context.source.type === "youtube"}
        <YoutubeContext {sentence} />
    {:else if sentence.context.source.type === "twitter"}
        <TwitterContext {sentence} />
    {:else}
        <p>Unknown context type: {sentence.context.source.type}</p>
    {/if}
</div>

<style>
    .context-card-container {
        width: 800px;
        height: 600px;
        background-color: #fff;
        border-radius: 4px;
        /* big box shadow */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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