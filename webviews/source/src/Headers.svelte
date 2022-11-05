<script>
  export let data;
  export let addHeader;
  export let removeHeader;
  export let height;

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

<div class="container" style="--height: {height}px;">
  <table>
    <tr>
      <center>
        <div>gRPC Headers</div>
      </center>
    </tr>
    {#each data.headers as header}
      <tr>
        {#if header.active}
          <vscode-checkbox checked on:click="{onHeaderClicked(header.value)}">
            <div>{header.value}</div>
          </vscode-checkbox>
        {:else}
          <vscode-checkbox on:click="{onHeaderClicked(header.value)}">
            <div>{header.value}</div>
          </vscode-checkbox>
        {/if}
      </tr>
    {/each}
    <tr>
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
</div>

<style>
  .container {
    height: var(--height);
    overflow-y: scroll;
    width: 100%;
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
  vscode-button {
    margin: 10px;
  }
</style>
