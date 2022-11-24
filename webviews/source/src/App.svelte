<script>
  $: connection = {
    uuid: `someuuid`,
    name: `keks`,
    group: `feks`,
    timeout: 0.5,
    useFile: false,
    adress: "localhost:8080",
    plaintext: true,
    filePath: `filepath`,
    importPaths: `/`,
    connectStatus: `not_connected`,
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
  }
</script>

<center>
  <img
    align="center"
    height="92px"
    alt="gRPC"
    src="https://cncf-branding.netlify.app/img/projects/grpc/icon/color/grpc-icon-color.png"
  />
</center>

<center>
  <h2>Connection assistant</h2>
</center>

<hr />

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

  {#if connection.useFile}
    <tr>
      <th class="left">
        <h4>Proto path</h4>
      </th>
      <th class="middle">
        <i>Name of a source proto path for generating schema</i>
      </th>
      <th class="right">
        <textarea rows="1" bind:value={connection.filePath} />
      </th>
    </tr>
  {/if}

  {#if connection.useFile}
    <tr>
      <th class="left">
        <h4>Import paths</h4>
      </th>
      <th class="middle">
        <i>Additional required import paths(splitted dy comma)</i>
      </th>
      <th class="right">
        <textarea rows="1" bind:value={connection.importPaths} />
      </th>
    </tr>
  {/if}
</table>

<hr />

<button on:click={createConnection}>Create connection</button>

<style>
  hr {
    width: 60%;
  }
  table {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20%;
    padding-right: 20%;
  }
  tr {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .left {
    width: 25%;
    text-align: left;
  }
  .middle {
    width: 70%;
    text-align: left;
  }
  .right {
    width: 25%;
    text-align: left;
  }
  img {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  vscode-dropdown {
    width: 320px;
  }
  textarea {
    width: 320px;
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
