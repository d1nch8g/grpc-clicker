<script>
  export let reqName = "";
  export let reqJson = "";
  export let onChange;
  $: innerHeight = 0;
  $: height = innerHeight - 170;
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
    bind:value="{reqJson}"
    on:input="{onChange}"></textarea>
</div>

<style>
  center {
    padding-bottom: 10px;
  }
  div {
    padding-top: 2%;
    padding-left: 7%;
    padding-right: 3%;
  }
  textarea {
    resize: none;
    height: var(--height);
    padding: 8px;
  }
</style>
