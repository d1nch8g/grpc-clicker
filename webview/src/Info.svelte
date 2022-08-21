<script>
  export let data;
</script>

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
      <div>{data.call}</div>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <div>Input message</div>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <div>{data.inputMessageName}</div>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <div>Output message</div>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <div>{data.outputMessageName}</div>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">
      <div>Max message size</div>
    </vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">
      <div>{data.maxMsgSize} mb</div>
    </vscode-data-grid-cell>
  </vscode-data-grid-row>
</vscode-data-grid>
