<script>
  import JsonArea from "./JsonArea.svelte";
  export let data;
  export let height;
  export let onSnippet;
</script>

<table>
  <tr>
    <center>
      <div>gRPCurl command snippet</div>
    </center>
  </tr>
  <tr>
    <JsonArea
      bind:text={data.snippet}
      highlight={false}
      editable={false}
      {height}
    />
  </tr>
  <tr>
    <div class="button-padding">
      <center class="button-center">
        <button on:click={onSnippet}>Generate gRPCurl CLI command</button>
      </center>
    </div>
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
    padding-top: 2px;
    padding-bottom: 5px;
  }
  button {
    border: none;
    padding: var(--input-padding-vertical) var(--input-padding-horizontal);
    width: 100%;
    text-align: center;
    outline: 1px solid transparent;
    outline-offset: 2px !important;
    color: var(--vscode-button-foreground);
    background: var(--vscode-button-background);
    padding-top: 6px;
    padding-bottom: 6px;
  }
  button:hover {
    cursor: pointer;
    background: var(--vscode-button-hoverBackground);
  }
  button:focus {
    outline-color: var(--vscode-focusBorder);
  }
  .button-center {
    padding-top: 10px;
    padding-bottom: 5px;
  }

  .button-padding {
    padding-top: 10px;
    padding-left: 30px;
    padding-right: 30px;
  }
</style>
