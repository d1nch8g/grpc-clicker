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
          {#if data.code !== ``}
            <div>{data.code}</div>
          {:else}
            <div>Not executed</div>
          {/if}
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          {#if data.time !== ``}
            <div>{data.time} seconds</div>
          {:else}
            <div>0 seconds</div>
          {/if}
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
      style="--height: {innerHeight - 220}px"
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
