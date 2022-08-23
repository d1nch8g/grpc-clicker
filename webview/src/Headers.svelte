<script>
  export let data;
  export let addHeader;
  export let removeHeader;

  function onHeaderClicked(value) {
    let headersForRequest = [];
    for (const [index, header] of data.headers.entries()) {
      if (header.value === value) {
        data.headers[index].active = !header.active;
      }
      if (data.headers[index].active) {
        headersForRequest.push(header.value);
      }
    }
    data.request.headers = headersForRequest;
  }
</script>

<table>
  <tr>
    <center>
      <div>gRPC Headers</div>
    </center>
  </tr>

  <tr>
    <ul>
      {#each data.headers as header}
        <li>
          {#if header.active}
            <vscode-checkbox checked on:click="{onHeaderClicked(header.value)}">
              <div>{header.value}</div>
            </vscode-checkbox>
          {:else}
            <vscode-checkbox on:click="{onHeaderClicked(header.value)}">
              <div>{header.value}</div>
            </vscode-checkbox>
          {/if}
        </li>
      {/each}
    </ul>
  </tr>

  <tr class="headers">
    <center>
      <vscode-button on:click="{removeHeader}" appearance="secondary">
        <div>Remove</div>
      </vscode-button>
      <vscode-button on:click="{addHeader}">
        <div>Add</div>
      </vscode-button>
    </center>
  </tr>
</table>

<style>
  vscode-button {
    margin: 10px;
  }
  ul {
    list-style-type: none;
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
