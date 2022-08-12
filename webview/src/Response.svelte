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
  <vscode-panels>
    <vscode-panel-tab id="tab-1">RESPONSE</vscode-panel-tab>
    <vscode-panel-tab id="tab-2">TESTING</vscode-panel-tab>
    <vscode-panel-tab id="tab-3">INFORMATION</vscode-panel-tab>
    <vscode-panel-view id="view-1">
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
    </vscode-panel-view>
    <vscode-panel-view id="view-2">Output content.</vscode-panel-view>
    <vscode-panel-view id="view-3">Debug content.</vscode-panel-view>
  </vscode-panels>
</div>

<style>
  center {
    padding-bottom: 10px;
  }
  div {
    padding-left: 1%;
    padding-right: 3%;
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
