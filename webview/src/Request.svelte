<script>
  export let reqName = "";
  export let reqJson = "";
  $: innerHeight = 0;
  $: height = innerHeight - 200;
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <p1>Request - {reqName}</p1>
  </center>

  <textarea
    name=""
    id=""
    cols="30"
    rows="10"
    style="--height: {height}px"
    bind:value="{reqJson}"></textarea>
</div>

<style>
  center {
    padding-bottom: 10px;
  }
  div {
    padding-top: 2%;
    padding-left: 7%;
    padding-right: 3%;
    padding-bottom: 5%;
  }
  textarea {
    resize: none;
    height: var(--height);
  }
</style>
