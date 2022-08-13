<script>
  export let data;
  export let edit;
  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<table>
  <tr>
    <vscode-data-grid aria-label="Basic">
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1">
          <div>Message tag</div>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          <div>{data.inputMessageTag}</div>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
    </vscode-data-grid>
  </tr>
  <tr>
    <center>
      <b>Request type: {data.inputMessageName}</b>
    </center>
  </tr>
  <tr>
    <textarea
      class="code"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {innerHeight - 220}px"
      bind:value="{data.json}"
      on:input="{edit}"></textarea>
  </tr>
</table>

<style>
  table {
    width: 100%;
  }
  tr {
    width: 100%;
  }
  center {
    padding-top: 10px;
    padding-bottom: 5px;
  }
  textarea {
    height: var(--height);
    resize: none;
    display: block;
    width: 98%;
    padding: 6px;
    color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  }
  textarea:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
</style>
