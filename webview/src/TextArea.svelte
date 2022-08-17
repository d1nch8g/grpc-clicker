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
    <div class="redwrapper">{text}</div>
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
    position: relative;
  }
  /* .redwrapperbox {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .main {
    width: 100%;
  } */
  .maineditor {
    height: var(--height);
    resize: none;
    display: block;
    width: 98%;
    padding: 4px;
    color: transparent;
    caret-color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  }
  .maineditor:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
  .maineditor::-moz-selection {
    /* color: blue; */
    /* text-shadow: none; */
  }
  .maineditor::selection {
    color: blue;
    text-shadow: aqua;
    /* text-shadow: none; */
  }
  /* .redwrapper {
    width: 100%;
    padding: 7px;
    color: red;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
    pointer-events: none;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  } */
</style>
