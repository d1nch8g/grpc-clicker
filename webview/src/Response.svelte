<script>
  export let requestData;
  $: innerHeight = 0;
  $: height = innerHeight - 150;

  $: template = `Response Code: ${requestData.code}\nTime: ${requestData.time}\nDate: ${requestData.date}\nResponse:\n${requestData.response}`;
  $: if (requestData.time === ``) {
    template = ``;
  }
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <vscode-option>Response: {requestData.outputMessageName}</vscode-option>
  </center>
  {#if requestData.response === "waiter"}
    <div class="top-space" style="--height: {height / 2.2}px"></div>
    <center>
      <vscode-progress-ring></vscode-progress-ring>
    </center>
  {:else}
    <textarea
      class="code"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      readonly>{template}</textarea
    >
  {/if}
</div>

<style>
  center {
    padding-bottom: 10px;
  }
  div {
    padding-top: 10px;
    padding-left: 3%;
    padding-right: 7%;
  }
  .top-space {
    height: var(--height);
  }
  textarea {
    height: var(--height);
    resize: none;
    display: block;
    width: 100%;
    color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    padding: 6px;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  }
  textarea:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
</style>
