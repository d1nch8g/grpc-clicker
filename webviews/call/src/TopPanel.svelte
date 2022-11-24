<script>
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
        <vscode-tag class="expanded">{data.request.source.adress}</vscode-tag>
      </td>
      <td>
        <vscode-button on:click="{onSend}">Send</vscode-button>
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
  vscode-dropdown {
    width: 100%;
  }
  .expanded {
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
