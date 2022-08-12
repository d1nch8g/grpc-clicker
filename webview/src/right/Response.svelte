<script>
  import ResponseInfo from ".../ResponseInfo.svelte";

  export let requestData;
  $: innerHeight = 0;

  $: if (requestData.response === ``) {
    template = ``;
  }
</script>

<svelte:window bind:innerHeight />

<div>
  <vscode-panels>
    <vscode-panel-tab id="tab-1">OUTPUT</vscode-panel-tab>
    <vscode-panel-tab id="tab-2">INFORMATION</vscode-panel-tab>
    <vscode-panel-tab id="tab-3">TESTING</vscode-panel-tab>
    <vscode-panel-view id="view-1">
      <textarea
        class="code"
        name=""
        id=""
        cols="30"
        rows="10"
        style="--height: {innerHeight - 150}px"
        bind:value="{requestData.response}"
        readonly></textarea>
    </vscode-panel-view>
    <vscode-panel-view id="view-2"
      ><ResponseInfo data="{requestData}" /></vscode-panel-view
    >
    <vscode-panel-view id="view-3">INFORMATION CONTENT</vscode-panel-view>
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
