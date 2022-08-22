<script>
  export let data;

  function addHeader() {}

  function removeHeader() {}
</script>

<table>
  <tr>
    <center>
      <div>gRPC Headers</div>
    </center>
  </tr>

  <tr>
    <ul>
      {#each data.hosts as host}
        <li>BLYAT</li>
      {/each}
    </ul>
  </tr>

  <tr class="headers">
    <center>
      <vscode-button on:click="{removeHeader}">
        <div>Remove</div>
      </vscode-button>
      <vscode-button on:click="{addHeader}" appearance="secondary">
        <div>Add</div>
      </vscode-button>
    </center>
  </tr>
</table>

<style>
  vscode-button {
    margin: 10px;
  }
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
</style>
