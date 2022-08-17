<script>
  let text = "";

  $: redtext = text.replaceAll(`asd`, `   `);
  $: bluetext = text.replaceAll(`keks`, `    `);
</script>

<div class="containter">
  <div class="control">
    <textarea
      class="maineditor"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:value="{text}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="redtext"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:value="{redtext}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="bluetext"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:value="{bluetext}"></textarea>
  </div>
</div>

<style>
  .containter {
    width: 100%;
    position: relative;
    pointer-events: none;
  }
  .wrapper {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .control {
    width: 100%;
  }

  textarea {
    resize: none;
    display: block;
    width: 98%;
    padding: 6px;
    height: var(--height);
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  }

  .maineditor {
    color: transparent;
    caret-color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    pointer-events: auto;
  }
  .maineditor:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
  .maineditor::selection {
    color: transparent;
    background: var(--vscode-input-foreground);
  }

  .redtext {
    color: red;
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }
  .bluetext {
    color: blue;
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }
</style>
