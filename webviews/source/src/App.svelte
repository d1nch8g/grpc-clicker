<script>
  $: connection = {
    uuid: `someuuid`,
    name: `keks`,
    group: `feks`,
    timeout: 0.5,
    currentHost: "localhost:8080",
    additionalHosts: [],
    plaintext: true,
    filePath: undefined,
    group: undefined,
    importPaths: [],
  };

  window.addEventListener("message", (event) => {
    connection = JSON.parse(`${event.data}`);
    console.log(`Webview created with parameters: `, connection);
  });

  let showServerOptions = true;

  function setServerOptions() {
    showServerOptions = true;
  }

  function setLocalFileOptions() {
    showServerOptions = false;
  }
</script>

<center>
  <h2>gRPC connection assistant</h2>
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
      <textarea rows="1" bind:value="{connection.name}"></textarea>
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
      <textarea rows="1" bind:value="{connection.group}"></textarea>
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Timeout</h4>
    </th>
    <th class="middle">
      <i>Maximum time for request to be executed (seconds)</i>
    </th>
    <th class="right">
      <textarea rows="1" bind:value="{connection.timeout}"></textarea>
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Server</h4>
    </th>
    <th class="middle">
      <i>Destivation server that will be used to execute calls</i>
    </th>
    <th class="right">
      <textarea rows="1" bind:value="{connection.timeout}"></textarea>
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
        <vscode-option on:click="{setServerOptions}">
          <div>Reflect server</div>
        </vscode-option>
        <vscode-option on:click="{setLocalFileOptions}">
          <div>Proto file</div>
        </vscode-option>
      </vscode-dropdown>
    </th>
  </tr>
</table>

<style>
  hr {
    width: 60%;
  }
  table {
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
</style>
