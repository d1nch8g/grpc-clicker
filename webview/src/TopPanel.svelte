<script>
  export let service = "";
  export let call = "";
  export let protoName = "";
  export let hosts = ["http://localhost:12201"];
  export let onSend;
</script>

<div class="top-container">
  <table>
    <tr>
      <td><vscode-badge>{protoName}</vscode-badge></td>
      <td><vscode-badge>{service}</vscode-badge></td>
      <td><vscode-badge>{call}</vscode-badge></td>
      <td class="expanded">
        <vscode-dropdown>
          {#each hosts as host}
            <vscode-option
              on:click="{() => {
                vscode.postMessage({
                  command: 'host',
                  text: host,
                });
              }}">{host}</vscode-option
            >
          {/each}
        </vscode-dropdown>
      </td>
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
