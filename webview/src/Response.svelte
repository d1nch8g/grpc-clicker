<script>
  export let respName = "";
  export let respJson = "";
  $: innerHeight = 0;
  $: height = innerHeight - 170;
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <vscode-option>Response - {respName}</vscode-option>
  </center>
  {#if respJson !== "waiter"}
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      readonly>{respJson}</textarea
    >
  {:else}
    <div class="top-space" style="--height: {height / 2.2}px"></div>
    <center>
      <vscode-progress-ring></vscode-progress-ring>
    </center>
  {/if}
</div>

<style>
  center {
    padding-bottom: 10px;
  }
  div {
    padding-top: 2%;
    padding-left: 3%;
    padding-right: 7%;
  }
  textarea {
    resize: none;
    height: var(--height);
    padding: 8px;
  }
  .top-space {
    height: var(--height);
  }
</style>
