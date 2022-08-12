<script>
  export let requestData;
  export let edit;
  $: innerHeight = 0;

  $: bordercolor = `#FF5555`;

  function validate(input) {
    try {
      JSON.parse(input);
      console.log(`ok`);
    } catch {
      console.log(`nok`);
    }
  }

  $: validate(requestData.json);
</script>

<svelte:window bind:innerHeight />

<div>
  <center>
    <vscode-option>Request: {requestData.inputMessageName}</vscode-option>
  </center>

  <textarea
    class="code"
    name=""
    id=""
    cols="30"
    rows="10"
    style="--height: {innerHeight - 150}px"
    bind:value="{requestData.json}"
    on:input="{edit}"></textarea>
</div>

<style>
  center {
    padding-bottom: 10px;
  }
  div {
    padding-top: 10px;
    padding-left: 7%;
    padding-right: 3%;
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
