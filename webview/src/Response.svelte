<script>
  export let respName = "";
  export let response = "";
  $: innerHeight = 0;
  $: height = innerHeight - 200;
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <p1>Response - {respName}</p1>
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
    padding-bottom: 10px;
  }
  div {
    padding: 5%;
  }
  textarea {
    resize: none;
    height: var(--height);
  }
</style>
