<script>
  export let reqeustData = { hosts: [{ adress: ``, plaintext: true }] };
  export let onSend;
  export let onExport;
  export let onHost;
  reqeustData.hosts = { hosts: [{ adress: ``, plaintext: true }] };
</script>

<div class="top-container">
  <table>
    <tr>
      <td><vscode-badge>{reqeustData.protoName}</vscode-badge></td>
      <td><vscode-badge>{reqeustData.service}</vscode-badge></td>
      <td><vscode-badge>{reqeustData.call}</vscode-badge></td>
      <td class="expanded">
        <vscode-dropdown>
          {#each reqeustData.hosts as host}
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
    padding-top: 1%;
    padding-left: 6%;
    padding-right: 6%;
  }
  table {
    margin: 4px;
    border: 0.2px solid;
    border-collapse: collapse;
  }
  td {
    margin: 6px;
    padding: 6px;
    border: 0.2px solid;
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
