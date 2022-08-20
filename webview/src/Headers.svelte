<script>
  export let data = { headers: [] };
</script>

<table>
  <tr>
    <center>
      <div>Request headers</div>
    </center>
  </tr>

  {#each data.headers as header}
    {#if header.active}
      <tr>
        <vscode-checkbox checked>{header.value}</vscode-checkbox>
      </tr>
    {:else}
      <tr>
        <vscode-checkbox>Label</vscode-checkbox>
      </tr>
    {/if}
  {/each}
</table>
