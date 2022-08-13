<script>
  export let data;
</script>

<table>
  <tr>
    <vscode-data-grid aria-label="Basic">
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1">
          <b>Expected time</b>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          <b>{data.protoName}</b>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1" class="ecode">
          <b>Expected code</b>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          <vscode-dropdown position="below">
            <vscode-option>OK</vscode-option>
            <vscode-option>Cancelled</vscode-option>
            <vscode-option>Unknown</vscode-option>
            <vscode-option>InvalidArgument</vscode-option>
            <vscode-option>DeadlineExceeded</vscode-option>
            <vscode-option>NotFound</vscode-option>
            <vscode-option>AlreadyExists</vscode-option>
            <vscode-option>PermissionDenied</vscode-option>
            <vscode-option>ResourceExhausted</vscode-option>
            <vscode-option>FailedPrecondition</vscode-option>
            <vscode-option>Aborted</vscode-option>
            <vscode-option>OutOfRange</vscode-option>
            <vscode-option>Unimplemented</vscode-option>
            <vscode-option>Internal</vscode-option>
            <vscode-option>Unavailable</vscode-option>
            <vscode-option>DataLoss</vscode-option>
            <vscode-option>Unauthenticated</vscode-option>
          </vscode-dropdown>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
    </vscode-data-grid>
  </tr>
  <tr>
    <vscode-data-grid aria-label="Basic">
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1" class="ecode">
          <b><center>Expected response JSON</center></b>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
    </vscode-data-grid>
  </tr>
</table>

<style>
  table {
    width: 100%;
  }
  tr {
    width: 100%;
  }
  vscode-dropdown {
    width: 100%;
  }
  vscode-option {
    width: 100%;
  }
  .ecode {
    padding-top: 10px;
  }
</style>
