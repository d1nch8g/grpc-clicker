<script>
  export let data;
  export let height;
</script>

<div class="container" style="--height: {height}px;">
  <table>
    <tr>
      <center>
        <div>INFO</div>
      </center>
    </tr>
  </table>
  <vscode-data-grid aria-label="Basic" grid-template-columns="40% 60%">
    {#if data.request.file !== undefined}
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1">
          <div>Proto path</div>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          <div>{data.request.file.filePath}</div>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
    {/if}
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <div>Proto package</div>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <div>{data.info.protoPackage}</div>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <div>Service</div>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <div>{data.info.service}</div>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <div>RPC Call</div>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <div>{data.info.call}</div>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <div>Input message</div>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <div>{data.info.inputMessageName}</div>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <div>Output message</div>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <div>{data.info.outputMessageName}</div>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <div>Max response size</div>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <div>{data.request.maxMsgSize} mb</div>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
  </vscode-data-grid>
</div>

<style>
  .container {
    height: var(--height);
    width: 100%;
    overflow-y: scroll;
  }
  table {
    width: 100%;
  }
  tr {
    width: 100%;
  }
</style>
