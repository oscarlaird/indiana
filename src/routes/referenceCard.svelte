<script>
    export let context; // a source object also including the specific chunk text
</script>

<div class="reference-card">
    {context.title}
</div>

<style>
    .reference-card {
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        padding: 16px;
        margin-bottom: 16px;
    }
</style>