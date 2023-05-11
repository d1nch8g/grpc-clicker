<script>
  const link = "https://fmnx.io/dancheg97/grpc-clicker/raw/branch";
  $: connection = {
    uuid: `someuuid`,
    name: `keks`,
    group: `feks`,
    timeout: 0.5,
    useFile: false,
    adress: "localhost:8080",
    plaintext: true,
    filePath: `filepath`,
    importPath: `/`,
    unix: false,
    customFlags: ``,
    connectStatus: `NOT_EXECUTED`,
  };

  window.addEventListener("message", (event) => {
    connection = JSON.parse(`${event.data}`);
    console.log(`Webview created with parameters: `, connection);
  });

  function onChange(connection) {
    console.log(`webview connection chaged:`, connection);
    vscode.postMessage({
      command: "change",
      text: JSON.stringify(connection),
    });
  }
  $: onChange(connection);

  function setFileSource() {
    connection.useFile = true;
  }

  function setServerSource() {
    connection.useFile = false;
  }

  function setUnixFalse() {
    connection.unix = false;
  }

  function setUnixTrue() {
    connection.unix = true;
  }

  function enablePlaintext() {
    connection.plaintext = true;
  }

  function disablePlaintext() {
    connection.plaintext = false;
  }

  function createConnection() {
    vscode.postMessage({
      command: "create",
    });
    connection.connectStatus = `WAITING`;
  }

  function pickProtoFile() {
    vscode.postMessage({
      command: "file",
    });
  }

  function getFilePathView() {
    return `.../` + connection.filePath.replace(/^.*[\\\/]/, "");
  }
</script>

<center>
  {#if connection.connectStatus === `NOT_EXECUTED`}
    <img src="{link}/main/images/logo.svg" alt="background" />
  {:else if connection.connectStatus === `WAITING`}
    <div align="center" class="loader" />
  {:else if connection.connectStatus === `ERROR`}
    <img src="{link}/main/images/error.svg" alt="background" />
  {:else if connection.connectStatus === `SUCCESS`}
    <img src="{link}/main/images/success.svg" alt="background" />
  {/if}
</center>

<center>
  <h2>Proto schema assistant</h2>
</center>

<vscode-divider />

<table>
  <tr>
    <th class="left">
      <h4>Name</h4>
    </th>
    <th class="middle">
      <i>Visible string for connection in list</i>
    </th>
    <th class="right">
      <textarea rows="1" bind:value={connection.name} />
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Group</h4>
    </th>
    <th class="middle">
      <i>Group which connection will belong to, optional</i>
    </th>
    <th class="right">
      <textarea rows="1" bind:value={connection.group} />
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Adress</h4>
    </th>
    <th class="middle">
      <i>Default adress of destination for gRPC calls</i>
    </th>
    <th class="right">
      <textarea rows="1" bind:value={connection.adress} />
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Plaintext</h4>
    </th>
    <th class="middle">
      <i>Wether to use plaintext or not (for server with TLS - off)</i>
    </th>
    <th class="right">
      <vscode-dropdown>
        <vscode-option on:click={enablePlaintext}>
          <div>Yes</div>
        </vscode-option>
        <vscode-option on:click={disablePlaintext}>
          <div>No</div>
        </vscode-option>
      </vscode-dropdown>
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Connection type</h4>
    </th>
    <th class="middle">
      <i>You can get schema from reflect server or local file</i>
    </th>
    <th class="right">
      <vscode-dropdown>
        <vscode-option on:click={setServerSource}>
          <div>Reflect server</div>
        </vscode-option>
        <vscode-option on:click={setFileSource}>
          <div>Proto file</div>
        </vscode-option>
      </vscode-dropdown>
    </th>
  </tr>

  {#if !connection.useFile}
    <tr>
      <th class="left">
        <h4>Timeout</h4>
      </th>
      <th class="middle">
        <i>Maximum time to recieve proto schema from server</i>
      </th>
      <th class="right">
        <textarea rows="1" bind:value={connection.timeout} />
      </th>
    </tr>
  {/if}

  {#if !connection.useFile}
    <tr>
      <th class="left">
        <h4>Unix</h4>
      </th>
      <th class="middle">
        <i>Indicates that server address is path to Unix domain socket</i>
      </th>
      <th class="right">
        <vscode-dropdown>
          <vscode-option on:click={setUnixFalse}>
            <div>No</div>
          </vscode-option>
          <vscode-option on:click={setUnixTrue}>
            <div>Yes</div>
          </vscode-option>
        </vscode-dropdown>
      </th>
    </tr>
  {/if}

  {#if connection.useFile}
    <tr>
      <th class="left">
        <h4>Proto path</h4>
      </th>
      <th class="middle">
        <i>Name of a source proto path for generating schema</i>
      </th>
      <th class="right">
        {#if connection.filePath === ``}
          <vscode-button on:click={pickProtoFile}>
            <div>Pick proto file</div>
          </vscode-button>
        {:else}
          <vscode-button on:click={pickProtoFile}>
            <div>{getFilePathView()}</div>
          </vscode-button>
        {/if}
      </th>
    </tr>
  {/if}

  {#if connection.useFile}
    <tr>
      <th class="left">
        <h4>Import path</h4>
      </th>
      <th class="middle">
        <i>Path to directory from which proto sources can be imported</i>
      </th>
      <th class="right">
        <textarea rows="1" bind:value={connection.importPath} />
      </th>
    </tr>
  {/if}

  <tr>
    <th class="left">
      <h4>Custom flags</h4>
    </th>
    <th class="middle">
      <i>Additional flags for grpcurl CLI command</i>
    </th>
    <th class="right">
      <textarea rows="1" bind:value={connection.customFlags} />
    </th>
  </tr>
</table>

<vscode-divider />

<button on:click={createConnection}>Add schema</button>

<style>
  .loader {
    border: 16px solid var(--vscode-editor-background);
    border-top: 16px solid var(--vscode-focusBorder);
    border-radius: 50%;
    width: 92px;
    height: 92px;
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  img {
    border: 16px solid transparent;
    border-top: 16px solid transparent;
    height: 92px;
  }
  vscode-divider {
    margin-left: 20%;
    width: 60%;
  }
  table {
    width: 60%;
    margin-left: 20%;
  }
  tr {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .left {
    width: 15%;
    text-align: left;
  }
  .middle {
    width: 40%;
    text-align: left;
  }
  .right {
    width: 100%;
  }
  vscode-dropdown {
    width: 100%;
  }
  textarea {
    width: 100%;
    resize: none;
    display: block;
    height: inherit;
    box-sizing: border-box;
    pointer-events: auto;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
    caret-color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-sideBar-background);
    color: var(--vscode-foreground);
  }
  button {
    border: none;
    padding: var(--input-padding-vertical) var(--input-padding-horizontal);
    width: 40%;
    text-align: center;
    outline: 1px solid transparent;
    outline-offset: 2px !important;
    color: var(--vscode-button-foreground);
    background: var(--vscode-button-background);
    padding-top: 6px;
    padding-bottom: 6px;
    margin-top: 10px;
    margin-left: 30%;
  }
  button:hover {
    cursor: pointer;
    background: var(--vscode-button-hoverBackground);
  }
  button:focus {
    outline-color: var(--vscode-focusBorder);
  }
</style>
