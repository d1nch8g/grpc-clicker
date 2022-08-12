<script>
  export let requestData = { hosts: [{ adress: ``, plaintext: true }] };
  export let onSend;
  export let onExport;
  export let onHost;
  requestData.hosts = { hosts: [{ adress: ``, plaintext: true }] };
</script>

<div class="top-container">
  <table>
    <tr>
      <td><vscode-badge>{requestData.protoName}</vscode-badge></td>
      <td><vscode-badge>{requestData.service}</vscode-badge></td>
      <td><vscode-badge>{requestData.call}</vscode-badge></td>
      <td class="expanded">
        <vscode-dropdown>
          {#each requestData.hosts as host}
            <vscode-option on:click="{onHost(host)}"
              >{host.adress}</vscode-option
            >
          {/each}
        </vscode-dropdown>
      </td>
      <td><vscode-button on:click="{onExport}">Export</vscode-button></td>
      <td><vscode-button on:click="{onSend}">Send</vscode-button></td>
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
