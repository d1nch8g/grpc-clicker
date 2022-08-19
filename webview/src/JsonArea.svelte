<script>
  let text = `[
  {
    "id": "0001",
    "type": "donut",
    "name": "Cake",
    "ppu": 0.55,
    "batters":
      {
        "batter":
          [
            { "id": "1001", "type": "Regular" },
            { "id": "1002", "type": "Chocolate" },
            { "id": "1003", "type": "Blueberry" },
            { "id": "1004", "type": "Devil's Food" }
          ]
      },
    "topping":
      [
        { "id": "5001", "type": "None" },
        { "id": "5002", "type": "Glazed" },
        { "id": "5005", "type": "Sugar" },
        { "id": "5007", "type": "Powdered Sugar" },
        { "id": "5006", "type": "Chocolate with Sprinkles" },
        { "id": "5003", "type": "Chocolate" },
        { "id": "5004", "type": "Maple" }
      ]
  }
]`;
  let height = 500;

  let scrollParent;
  let bracketsScrollChild;
  let stringsScrollChild;
  let numbersScrollChild;
  let boolScrollChild;
  let markupScrollChild;
  function parseScroll() {
    bracketsScrollChild.scrollTop = scrollParent.scrollTop;
    stringsScrollChild.scrollTop = scrollParent.scrollTop;
    numbersScrollChild.scrollTop = scrollParent.scrollTop;
    boolScrollChild.scrollTop = scrollParent.scrollTop;
    markupScrollChild.scrollTop = scrollParent.scrollTop;
  }

  let bracketsText = "";
  let stringsText = "";
  let numbersText = "";
  let boolText = "";
  let markupText = "";

  $: parse(text);

  const space = ` `;
  const noBreakSpace = `\xa0`;
  const newline = `
`;

  function parse(text) {
    let toString = false;
    bracketsText = "";
    stringsText = "";
    numbersText = "";
    boolText = "";
    markupText = "";
    for (const letter of text) {
      if (letter === newline || letter === space) {
        bracketsText += letter;
        stringsText += letter;
        numbersText += letter;
        boolText += letter;
        markupText += letter;
        continue;
      }
      if (toString && letter !== `"`) {
        bracketsText += noBreakSpace;
        stringsText += letter;
        numbersText += noBreakSpace;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (`{}[]`.includes(letter)) {
        bracketsText += letter;
        stringsText += noBreakSpace;
        numbersText += noBreakSpace;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (letter === `"`) {
        toString = !toString;
        bracketsText += noBreakSpace;
        stringsText += letter;
        numbersText += noBreakSpace;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (`1234567890.`.includes(letter)) {
        bracketsText += noBreakSpace;
        stringsText += noBreakSpace;
        numbersText += letter;
        boolText += noBreakSpace;
        markupText += noBreakSpace;
        continue;
      }
      if (`truefalsnu`.includes(letter)) {
        bracketsText += noBreakSpace;
        stringsText += noBreakSpace;
        numbersText += noBreakSpace;
        boolText += letter;
        markupText += noBreakSpace;
        continue;
      }
      bracketsText += noBreakSpace;
      stringsText += noBreakSpace;
      numbersText += noBreakSpace;
      boolText += noBreakSpace;
      markupText += letter;
    }
  }
</script>

<div class="containter">
  <div class="control">
    <textarea
      class="maineditor"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      bind:this="{scrollParent}"
      bind:value="{text}"
      on:scroll="{parseScroll}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="bracketcolor"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      bind:this="{bracketsScrollChild}"
      value="{bracketsText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="stringcolor"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      bind:this="{stringsScrollChild}"
      bind:value="{stringsText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="numbercolor"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      bind:this="{numbersScrollChild}"
      bind:value="{numbersText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="boolcolor"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      bind:this="{boolScrollChild}"
      bind:value="{boolText}"></textarea>
  </div>

  <div class="wrapper">
    <textarea
      class="markupcolor"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {height}px"
      bind:this="{markupScrollChild}"
      bind:value="{markupText}"></textarea>
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
    color: var(--vscode-debugIcon-breakpointCurrentStackframeForeground);
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }

  .stringcolor {
    color: var(--vscode-debugTokenExpression-string);
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }

  .numbercolor {
    color: var(--vscode-debugTokenExpression-number);
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }

  .boolcolor {
    color: var(--vscode-debugTokenExpression-boolean);
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }

  .markupcolor {
    color: var(--vscode-foreground);
    caret-color: transparent;
    outline-color: transparent;
    background-color: transparent;
    border-color: transparent;
  }
</style>
