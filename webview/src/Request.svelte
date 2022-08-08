<script>
  export let reqName = "";
  export let json = "";
  export let edit;
  $: innerHeight = 0;
  $: height = innerHeight - 170;
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <vscode-option>Request: {reqName}</vscode-option>
  </center>

  <textarea
    name=""
    id=""
    cols="30"
    rows="10"
    style="--height: {height}px"
    bind:value="{json}"
    on:input="{edit}"></textarea>
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
