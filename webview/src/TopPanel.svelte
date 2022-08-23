<script>
  export let data;
  export let onSend;
  export let onExport;
  export let onHosts;

  function hostPick(host, plaintext) {
    data.request.server.host = host;
    data.request.server.plaintext = plaintext;
  }
</script>

<div class="top-container">
  <table>
    <tr>
      <td><vscode-badge>{data.info.protoPackage}</vscode-badge></td>
      <td><vscode-badge>{data.info.service}</vscode-badge></td>
      <td><vscode-badge>{data.info.call}</vscode-badge></td>
      <td class="expanded">
        <vscode-dropdown>
          {#if data.request.file !== undefined}
            {#each data.hosts as host}
              <vscode-option on:click="{hostPick(host.adress, host.plaintext)}">
                <div>{host.adress}</div>
              </vscode-option>
            {/each}
          {:else}
            <vscode-option>
              <div>{data.request.server.host}</div>
            </vscode-option>
          {/if}
        </vscode-dropdown>
      </td>
      {#if data.request.file !== undefined}
        <td>
          <vscode-button on:click="{onHosts}" appearance="secondary">
            <div>Hosts</div>
          </vscode-button>
        </td>
      {/if}
      <td>
        <vscode-button on:click="{onExport}" appearance="secondary">
          <div>Export</div>
        </vscode-button>
      </td>
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
