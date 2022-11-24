<script>
  export let text;
  export let height;
  export let highlight = true;
  export let editable = true;

  let mainScroll;
  let bracketScroll;
  let keysScroll;
  let stringsScroll;
  let numbersScroll;
  let boolsScroll;
  let markupScroll;
  function parseScroll() {
    bracketScroll.scrollTop = mainScroll.scrollTop;
    keysScroll.scrollTop = mainScroll.scrollTop;
    stringsScroll.scrollTop = mainScroll.scrollTop;
    numbersScroll.scrollTop = mainScroll.scrollTop;
    boolsScroll.scrollTop = mainScroll.scrollTop;
    markupScroll.scrollTop = mainScroll.scrollTop;
  }

  $: parse(text);

  const space = ` `;
  const noBreakSpace = `\xa0`;
  const newline = `\n`;

  let bracketsText = "";
  let stringsText = "";
  let keysText = "";
  let numbersText = "";
  let boolText = "";
  let markupText = "";
  function parse(text) {
    if (!highlight) {
      markupText = text;
      return;
    }
    let toKey = false;
    let toString = false;
    bracketsText = "";
    stringsText = "";
    keysText = "";
    numbersText = "";
    boolText = "";
    markupText = "";
    for (const letter of text) {
      if (letter === newline || letter === space) {
        bracketsText += letter;
        stringsText += letter;
        keysText += letter;
        numbersText += letter;
        boolText += letter;
        markupText += letter;
        continue;
      }
      if (letter === `:`) {
        toString = true;
      }
      if (`[]{},`.includes(letter) && !toKey) {
        toString = false;
      }
      if (toKey && letter !== `"`) {
        if (toString) {
          bracketsText += noBreakSpace;
          stringsText += letter;
          keysText += noBreakSpace;
          numbersText += noBreakSpace;
          boolText += noBreakSpace;
          markupText += noBreakSpace;
          continue;
        }
        bracketsText += noBreakSpace;
        stringsText += noBreakSpace;
        keysText += letter;
        numbersText += noBreakSpace;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (letter === `"`) {
        toKey = !toKey;
        if (toString) {
          bracketsText += noBreakSpace;
          stringsText += letter;
          keysText += noBreakSpace;
          numbersText += noBreakSpace;
          boolText += noBreakSpace;
          markupText += noBreakSpace;
          continue;
        }
        bracketsText += noBreakSpace;
        stringsText += noBreakSpace;
        keysText += letter;
        numbersText += noBreakSpace;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (`{}[]`.includes(letter)) {
        bracketsText += letter;
        stringsText += noBreakSpace;
        keysText += noBreakSpace;
        numbersText += noBreakSpace;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (`1234567890.`.includes(letter)) {
        bracketsText += noBreakSpace;
        stringsText += noBreakSpace;
        keysText += noBreakSpace;
        numbersText += letter;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (`abcdefghijklmnopqrstuvwxyz`.includes(letter)) {
        bracketsText += noBreakSpace;
        stringsText += noBreakSpace;
        keysText += noBreakSpace;
        numbersText += noBreakSpace;
        boolText += letter;
        markupText += noBreakSpace;
        continue;
      }
      bracketsText += noBreakSpace;
      stringsText += noBreakSpace;
      keysText += noBreakSpace;
      numbersText += noBreakSpace;
      boolText += noBreakSpace;
      markupText += letter;
    }
  }
</script>

<div class="containter" style="--height: {height}px;">
  <div class="control">
    {#if !editable}
      <textarea
        readonly
        class="maineditor"
        bind:this="{mainScroll}"
        bind:value="{text}"
        on:scroll="{parseScroll}"></textarea>
    {:else}
      <textarea
        class="maineditor"
        bind:this="{mainScroll}"
        bind:value="{text}"
        on:scroll="{parseScroll}"></textarea>
    {/if}
  </div>

  <div class="wrapper">
    <textarea
      class="brackets transparenter"
      bind:this="{bracketScroll}"
      value="{bracketsText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="strings transparenter"
      bind:this="{stringsScroll}"
      bind:value="{stringsText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="keys transparenter"
      bind:this="{keysScroll}"
      bind:value="{keysText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="numbers transparenter"
      bind:this="{numbersScroll}"
      bind:value="{numbersText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="booleans transparenter"
      bind:this="{boolsScroll}"
      bind:value="{boolText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="punctuation transparenter"
      bind:this="{markupScroll}"
      bind:value="{markupText}"></textarea>
  </div>
</div>

<style>
  .containter {
    width: 100%;
    position: relative;
    pointer-events: none;
    height: var(--height);
  }
  .wrapper {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    height: inherit;
  }
  .control {
    width: 100%;
    height: inherit;
  }

  textarea {
    resize: none;
    display: block;
    width: 100%;
    height: inherit;
    box-sizing: border-box;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  }

  .maineditor {
    color: transparent;
    caret-color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-sideBar-background);
    pointer-events: auto;
  }
  .maineditor:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
  .maineditor::selection {
    color: transparent;
    background: var(--vscode-input-foreground);
  }

  .transparenter {
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  }
  .brackets {
    color: var(--vscode-debugIcon-breakpointCurrentStackframeForeground);
  }
  .strings {
    color: var(--vscode-debugTokenExpression-string);
  }
  .keys {
    color: var(--vscode-debugIcon-stepOverForeground);
  }
  .numbers {
    color: var(--vscode-debugTokenExpression-number);
  }
  .booleans {
    color: var(--vscode-debugTokenExpression-boolean);
  }
  .punctuation {
    color: var(--vscode-foreground);
  }
</style>
