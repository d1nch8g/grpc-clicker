<script>
  import JsonArea from "./JsonArea.svelte";
  export let data;
  export let height;
  export let createTest;

  function onTimeChanged(time) {
    if (time.endsWith(`s`)) {
      data.expectations.time = +time.slice(0, -1);
    } else {
      data.expectations.time = +time.slice(0, -1) * 60;
    }
  }

  const timeOptions = [
    `0.1s`,
    `0.25s`,
    `0.5s`,
    `1s`,
    `2s`,
    `3s`,
    `4s`,
    `5s`,
    `10s`,
    `15s`,
    `30s`,
    `1m`,
    `3m`,
    `5m`,
  ];

  function onCodeChanged(code) {
    data.expectations.code = code;
  }

  const codeOptions = [
    `OK`,
    `Cancelled`,
    `Unknown`,
    `InvalidArgument`,
    `DeadlineExceeded`,
    `NotFound`,
    `AlreadyExists`,
    `PermissionDenied`,
    `ResourceExhausted`,
    `FailedPrecondition`,
    `Aborted`,
    `OutOfRange`,
    `Unimplemented`,
    `Internal`,
    `Unavailable`,
    `DataLoss`,
    `Unauthenticated`,
  ];
</script>

<table>
  <tr>
    <table>
      <tr>
        <td class="expect-text">
          <b>Expected time</b>
        </td>
        <td class="expect-dropdown">
          <vscode-dropdown position="below">
            {#each timeOptions as time}
              <vscode-option on:click={onTimeChanged(time)}>
                <div>{time}</div>
              </vscode-option>
            {/each}
          </vscode-dropdown>
        </td>
      </tr>
      <tr>
        <td class="expect-text">
          <b>Expected code</b>
        </td>
        <td class="expect-dropdown">
          <vscode-dropdown position="below">
            {#each codeOptions as code}
              <vscode-option on:click={onCodeChanged(code)}>
                <div>{code}</div>
              </vscode-option>
            {/each}
          </vscode-dropdown>
        </td>
      </tr>
    </table>
  </tr>
  <tr>
    <center>
      <b>Expected response JSON</b>
    </center>
  </tr>
  <tr>
    <JsonArea bind:text={data.expectations.content} {height} />
  </tr>
  <tr>
    <div class="button-padding">
      <center>
        <button on:click={createTest}>Create test</button>
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
  .expect-text {
    width: 40%;
  }
  .expect-dropdown {
    width: 60%;
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

  center {
    padding-top: 10px;
    padding-bottom: 5px;
  }
</style>
