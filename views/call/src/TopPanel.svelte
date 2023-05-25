<script>
  // @ts-nocheck

  export let data;
  export let onSend;
</script>

<div class="top-container">
  <table>
    <tr>
      <td><vscode-badge>{data.info.protoPackage}</vscode-badge></td>
      <td><vscode-badge>{data.info.service}</vscode-badge></td>
      <td><vscode-badge>{data.info.call}</vscode-badge></td>
      <td class="expanded">
        <textarea
          name="a"
          cols="5"
          rows="1"
          oninput="this.value = this.value.replace(/\n/g,'')"
          bind:value={data.request.source.adress}
        />
      </td>
      <td>
        <vscode-button on:click={onSend}>Send</vscode-button>
      </td>
    </tr>
  </table>
</div>

<style>
  .top-container {
    padding-top: 15px;
    padding-left: 6%;
    padding-right: 6%;
  }
  table {
    margin: 4px;
    border: 2px;
    border-collapse: collapse;
    border: 1px solid;
    border-color: var(--vscode-input-border);
  }
  td {
    margin: 6px;
    padding: 6px;
    border: 1px solid;
    border-color: var(--vscode-input-border);
    border-collapse: collapse;
  }
  .expanded {
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }
  textarea {
    width: 100%;
    height: 23px;
    padding-top: 8px;
    resize: none;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
    color: var(--vscode-input-foreground);
    caret-color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-sideBar-background);
  }
</style>
