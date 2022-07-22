<script>
  export let name = "";
  export let response = "";
  $: innerHeight = 0;
  $: height = innerHeight - 220;
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <p1>RESPONSE - {name}</p1>
  </center>

  <textarea
    name=""
    id=""
    cols="30"
    rows="10"
    style="--height: {height}px"
    readonly>{response}</textarea
  >
</div>

<style>
  center {
    padding: 1.5%;
  }
  div {
    padding: 5%;
  }
  textarea {
    resize: none;
    height: var(--height);
  }
</style>
