<script>
    export let sentence;
    // get the video id from the youtube url context.source.url
    let videoId = sentence.context.source.url.split('v=')[1];
</script>



<iframe src="https://www.youtube.com/embed/{videoId}?start={sentence.timestamp - 2 || 0}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<style>
    iframe {
        width: 100%;
        height: 100%;
    }
</style>

