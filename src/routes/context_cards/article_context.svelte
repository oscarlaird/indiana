<script>
    export let sentence;

</script>

<!-- try to show the article's favicon -->

<h3>
    <a href={sentence.context.source.url} target="_blank">
        {sentence.context.source.title}
    </a>
</h3>
<p>{sentence.context.text}</p>

<style>
    p {
        font-size: 1.6rem;
        line-height: 1.3;
    }
    h3 {
        margin: 0;
    }
</style>