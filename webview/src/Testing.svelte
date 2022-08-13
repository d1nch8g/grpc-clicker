<script>
  export let data;

  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<table>
  <tr>
    <vscode-data-grid aria-label="Basic">
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1" class="dropdown">
          <b>Expected time</b>
        </vscode-data-grid-cell>
        <vscode-data-grid-cell grid-column="2">
          <vscode-dropdown position="below">
            <vscode-option>0.005s</vscode-option>
            <vscode-option>0.01s</vscode-option>
            <vscode-option>0.025s</vscode-option>
            <vscode-option>0.5s</vscode-option>
            <vscode-option>1s</vscode-option>
            <vscode-option>2s</vscode-option>
            <vscode-option>3s</vscode-option>
            <vscode-option>4s</vscode-option>
            <vscode-option>5s</vscode-option>
            <vscode-option>10s</vscode-option>
            <vscode-option>15s</vscode-option>
            <vscode-option>30s</vscode-option>
            <vscode-option>1m</vscode-option>
            <vscode-option>3m</vscode-option>
            <vscode-option>5m</vscode-option>
          </vscode-dropdown>
        </vscode-data-grid-cell>
      </vscode-data-grid-row>
      <vscode-data-grid-row>
        <vscode-data-grid-cell grid-column="1" class="dropdown">
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
  <tr>
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      style="--height: {innerHeight - 300}px"></textarea>
  </tr>
  <tr>
    <div class="button-padding">
      <center>
        <button on:click="{onClick}">Create test</button>
      </center>
    </div>
  </tr>
</table>

<style>
  vscode-dropdown {
    width: 100%;
  }
  vscode-option {
    width: 100%;
  }
  .button-padding {
    padding-top: 10px;
    padding-left: 30px;
    padding-right: 30px;
  }
  button {
    border: none;
    padding: var(--input-padding-vertical) var(--input-padding-horizontal);
    width: 100%;
    text-align: center;
    outline: 1px solid transparent;
    outline-offset: 2px !important;
    color: var(--vscode-button-foreground);
    background: var(--vscode-button-background);
    padding-top: 6px;
    padding-bottom: 6px;
  }
  button:hover {
    cursor: pointer;
    background: var(--vscode-button-hoverBackground);
  }
  button:focus {
    outline-color: var(--vscode-focusBorder);
  }
  table {
    width: 100%;
  }
  tr {
    width: 100%;
  }
  .dropdown {
    padding-top: 10px;
  }
  textarea {
    height: var(--height);
    resize: none;
    display: block;
    width: 98%;
    color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    padding: 6px;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
  }
</style>
