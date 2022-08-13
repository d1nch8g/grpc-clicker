<script>
  export let data;
  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<table>
  <tr>
    <center>
      {#if data.time === ``}
        <div>Response: {data.outputMessageName}</div>
      {:else}
        <div>{data.code} - {data.time}</div>
      {/if}
    </center>
  </tr>
  <tr>
    <textarea
      class="code"
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {innerHeight - 180}px"
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
    padding-top: 2px;
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
