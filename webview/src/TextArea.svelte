<script>
  let text = "";
</script>

<div class="wrapper">
  <div class="main">
    <textarea
      class="maineditor"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:value="{text}"></textarea>
  </div>
  <div class="redwrapperbox">
    <textarea
      class="redwrapper"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:value="{text}"></textarea>
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
    position: relative;
    pointer-events: none;
  }
  .redwrapperbox {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .main {
    width: 100%;
  }
  .maineditor {
    height: var(--height);
    resize: none;
    display: block;
    width: 98%;
    padding: 6px;
    color: transparent;
    caret-color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
    height: 200px;
    pointer-events: auto;
  }
  .maineditor:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
  .redwrapper {
    height: var(--height);
    resize: none;
    display: block;
    width: 98%;
    padding: 6px;
    color: red;
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
    border-color: transparent;
  }
</style>
