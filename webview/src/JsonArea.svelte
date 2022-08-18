<script>
  let text = "";

  let scrollParent = 0;
  let bracketScrollChild;
  function parseScroll() {
    bracketScrollChild.scrollTop = scrollParent.scrollTop;
  }

  let bracketsText = "";
  let stringsText = "";
  let numbersText = "";
  let boolText = "";

  function parse(text) {
    let toString = false;
    bracketsText = "";
    stringsText = "";
    numbersText = "";
    boolText = "";
    for (var i = 0; i < text.length; i++) {
      const letter = str.charAt(i);
      if (toString) {
        bracketsText += " ";
        stringsText += letter;
        numbersText += " ";
        boolText += " ";
        continue;
      }
      if (`{}[]`.includes(letter)) {
        bracketsText += letter;
        stringsText += " ";
        numbersText += " ";
        boolText += " ";
        continue;
      }
      if (letter === `"`) {
        toString = !toString;
        bracketsText += " ";
        stringsText += letter;
        numbersText += " ";
        boolText += " ";
        continue;
      }
      if (`1234567890.`.includes(letter)) {
        toString = !toString;
        bracketsText += " ";
        stringsText += " ";
        numbersText += letter;
        boolText += " ";
        continue;
      }
      bracketsText += " ";
      stringsText += " ";
      numbersText += " ";
      boolText += letter;
    }
  }

  $: parse(text);
</script>

<div class="containter">
  <div class="control">
    <textarea
      class="maineditor"
      name=""
      id=""
      cols="30"
      rows="10"
      on:scroll="{parseScroll}"
      bind:this="{scrollParent}"
      bind:value="{text}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="bracketcolor"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:this="{bracketScrollChild}"
      bind:value="{bracketsText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="stringcolor"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:this="{bracketScrollChild}"
      bind:value="{stringsText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="numbercolor"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:this="{bracketScrollChild}"
      bind:value="{numbersText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="boolcolor"
      name=""
      id=""
      cols="30"
      rows="10"
      bind:this="{bracketScrollChild}"
      bind:value="{boolText}"></textarea>
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

  .bracketcolor {
    color: red;
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }

  .stringcolor {
    color: blue;
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }

  .numbercolor {
    color: yellowgreen;
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }

  .boolcolor {
    color: cyan;
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }
</style>
