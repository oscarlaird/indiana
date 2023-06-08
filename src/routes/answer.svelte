<script>
    import { selected_context_idx } from "./stores.js";
    export let sentences;
</script>

<p>
{#each sentences as sentence}
    <!--  on:click={() => selected_context_idx.set(sentence.context_idx)}  -->
    <span class="sentence"
          on:mouseenter={() => selected_context_idx.set(sentence.context_idx)}
          on:mouseleave={() => selected_context_idx.set(null)}
          class:highlighted={sentence.context_idx === $selected_context_idx}
    >
        {sentence.text}
    </span>
{/each}
</p>

<style>
    .sentence {
        cursor: pointer;
    }

    .highlighted {
        background-color: yellow;
    }

</style>




