<script>
  export let data;
</script>

<vscode-data-grid aria-label="Basic">
  {#if data.path !== ``}
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <p>Proto path</p>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <p>{data.path}</p>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
  {/if}
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <p>Proto</p>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <p>{data.protoName}</p>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <p>Service</p>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <p>{data.service}</p>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <p>RPC Call</p>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <p>{data.call}</p>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <p>Input message</p>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <p>{data.inputMessageName}</p>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <p>Output message</p>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <p>{data.outputMessageName}</p>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <p>Max recieve message size</p>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <p>{data.maxMsgSize} mb</p>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  {#each data.metadata as header}
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <p>Header</p>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <p><i>{header}</i></p>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
  {/each}
  {#if data.time !== ``}
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <p>Response code</p>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <p>{data.code}</p>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <p>Time</p>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <p>{data.time} seconds</p>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">
        <p>Output message</p>
      </vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">
        <p>{data.outputMessageName}</p>
      </vscode-data-grid-cell>
    </vscode-data-grid-row>
  {/if}
</vscode-data-grid>
