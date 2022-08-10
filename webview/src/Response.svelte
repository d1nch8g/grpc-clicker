<script>
  export let reqeustData;
  $: innerHeight = 0;
  $: height = innerHeight - 140;
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <vscode-option>Response: {reqeustData.outputMessageName}</vscode-option>
  </center>
  {#if reqeustData.response === "waiter"}
    <div class="top-space" style="--height: {height / 2.2}px"></div>
    <center>
      <vscode-progress-ring></vscode-progress-ring>
    </center>
  {:else if reqeustData.time === ``}
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      readonly></textarea>
  {:else}
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      readonly
    >
Response Code: {reqeustData.code}
Time: {reqeustData.time}
Date: {reqeustData.date}
Response:
{reqeustData.response}</textarea
    >
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
