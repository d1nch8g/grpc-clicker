<script>
  export let data;
</script>

<vscode-data-grid aria-label="Basic">
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">Code</vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2">{data.code}</vscode-data-grid-cell>
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">Time</vscode-data-grid-cell>
    <vscode-data-grid-cell grid-column="2"
      >{data.time} seconds</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
  <vscode-data-grid-row>
    <vscode-data-grid-cell grid-column="1">Output message</vscode-data-grid-cell
    >
    <vscode-data-grid-cell grid-column="2"
      >{data.outputMessageName}</vscode-data-grid-cell
    >
  </vscode-data-grid-row>
</vscode-data-grid>
