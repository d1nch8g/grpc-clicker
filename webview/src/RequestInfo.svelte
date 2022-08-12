<script>
  export let data;
</script>

<vscode-data-grid aria-label="Basic">
  {#if data.path !== ``}
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">Proto path</vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">{data.path}</vscode-data-grid-cell>
    </vscode-data-grid-row>
  {/if}
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">Proto</vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2"
      >{data.protoName}</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">Service</vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">{data.service}</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">RPC Call</vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">{data.call}</vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">Input message</vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2"
      >{data.inputMessageName}</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">Output message</vscode-data-grid-cell
    >
    <vscode-data-grid-cell grid-column="2"
      >{data.outputMessageName}</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1"
      >Max recieve message size</vscode-data-grid-cell
    >
    <vscode-data-grid-cell grid-column="2"
      >{data.maxMsgSize} mb</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
  {#each data.metadata as header}
    <vscode-data-grid-row>
      <vscode-data-grid-cell grid-column="1">Header</vscode-data-grid-cell>
      <vscode-data-grid-cell grid-column="2">{header}</vscode-data-grid-cell>
    </vscode-data-grid-row>
  {/each}
</vscode-data-grid>
