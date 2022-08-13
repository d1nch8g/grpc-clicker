<script>
  export let data;
  $: innerHeight = 0;

  $: if (data.response === ``) {
    template = ``;
  }
</script>

<svelte:window bind:innerHeight />

<table>
  <tr>
    <vscode-data-grid aria-label="Basic">
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1">
          <div>Response code</div>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          <div>{data.code}</div>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1">
          <div>Time</div>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          <div>{data.time} seconds</div>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
    </vscode-data-grid>
  </tr>
  <tr>
    <center>
      <b>Response type: {data.outputMessageName}</b>
    </center>
  </tr>
  <tr>
    <textarea
      class="code"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {innerHeight - 250}px"
      bind:value="{data.response}"
      readonly></textarea>
  </tr>
</table>

<style>
  table {
    width: 100%;
  }
  tr {
    width: 100%;
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
  center {
    padding-top: 10px;
    padding-bottom: 5px;
  }
</style>
