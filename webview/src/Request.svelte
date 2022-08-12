<script>
  export let requestData;
  export let edit;
  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<div>
  <vscode-panels>
    <vscode-panel-tab id="tab-1">JSON INPUT</vscode-panel-tab>
    <vscode-panel-tab id="tab-2">REQUEST HEADERS</vscode-panel-tab>
    <vscode-panel-tab id="tab-3">INFORMATION</vscode-panel-tab>
    <vscode-panel-view id="view-1">
      <textarea
        class="code"
        name=""
        id=""
        cols="30"
        rows="10"
        style="--height: {innerHeight - 150}px"
        bind:value="{requestData.json}"
        on:input="{edit}"></textarea>
    </vscode-panel-view>
    <vscode-panel-view id="view-2">Output content.</vscode-panel-view>
    <vscode-panel-view id="view-3">Debug content.</vscode-panel-view>
  </vscode-panels>
</div>

<style>
  div {
    padding-left: 3%;
    padding-right: 1%;
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
