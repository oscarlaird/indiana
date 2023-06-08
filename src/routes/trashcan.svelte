<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div class="can" on:click={() => dispatch('click')}>
    <div class="can-side left"></div>
    <div class="can-side right"></div>
    <div class="can-side top"></div>
    <div class="tine center"></div>
    <div class="tine right"></div>
    <div class="tine left"></div>
    <div class="lid"></div>
    <div class="lid handle"></div>
</div>

<style>
    .tine {
        position: absolute;
        bottom: 20px;
        left: 50%;
        width: 0;
        height: 80px;
        border-width: 5px;
        border-style: solid;
        border-color: inherit;
        border-radius: 5px;
    }
    .tine.center {
        transform: translate(-50%);
        border-right: 0;
    }
    .tine.right {
        transform: translate(-50%) translate(23px) skew(-8deg);
        border-left: 0;
    }
    .tine.left {
        transform: translate(-50%) translate(-23px) skew(8deg);
        border-right: 0;
    }

    .can-side {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 40px;
        height: 120px;
        border-width: 5px;
        border-style: solid;
        border-color: inherit;
        border-radius: 5px;
    }
    .can-side.right {
        transform: translate(-50%) translate(20px) skew(-10deg);
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .can-side.left {
        transform: translate(-50%) translate(-20px) skew(10deg);
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .can-side.top {
        transform: translate(-50%);
        border-width: 6px;
        border-right: 0;
        border-left: 0;
        border-radius: 0;
    }
    .can .lid {
        position: absolute;
        bottom: 135px;
        left: 50%;
        width: 100px;
        height: 10px;
        border-width: 5px;
        border-style: solid;
        border-color: inherit;
        border-radius: 5px;
        transform: translate(-50%);
    }
    .can .lid.handle {
        width: 40px;
        bottom: 150px;
    }
    .can:hover .lid {
        transform: translate(-50%) rotate(-10deg);
    }


    .can {
        width: 120px;
        height: 170px;
        position: relative;
        border-color:black;
        transform: scale(0.3);
        cursor: pointer;
    }
    .can:hover {
        transform: scale(0.35);
        border-color: red;
    }

</style>