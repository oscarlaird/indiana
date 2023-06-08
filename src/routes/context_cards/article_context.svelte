<script>
    export let context;

</script>

<h3>
    <a href={context.source.url} target="_blank">
        {context.source.title}
    </a>
</h3>
<p>{context.text}</p>

<style>
    p {
        font-size: 1.6rem;
        line-height: 1.3;
    }
</style>