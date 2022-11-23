<script>
  $: data = {
    uuid: `someuuid`,
    timeout: 0.5,
    currentHost: "localhost:8080",
    additionalHosts: [],
    plaintext: true,
    filePath: undefined,
    group: undefined,
    importPaths: [],
  };

  window.addEventListener("message", (event) => {
    data = JSON.parse(`${event.data}`);
    console.log(`Webview created with parameters: `, data);
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
      <p>Visible string for connection in list</p>
    </th>
    <th class="right">
      <textarea rows="1" bind:value="{data.timeout}"></textarea>
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Group</h4>
    </th>
    <th class="middle">
      <p>Group which connection will belong to, optional</p>
    </th>
    <th class="right">
      <textarea rows="1" bind:value="{data.timeout}"></textarea>
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Timeout</h4>
    </th>
    <th class="middle">
      <p>Maximum time for request to be executed (seconds)</p>
    </th>
    <th class="right">
      <textarea rows="1" bind:value="{data.timeout}"></textarea>
    </th>
  </tr>

  <tr>
    <th class="left">
      <h4>Connection type</h4>
    </th>
    <th class="middle">
      <p>You can get schema from reflect server or local file</p>
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
    width: 20%;
    text-align: left;
  }
  .middle {
    width: 80%;
    text-align: left;
  }
  .right {
    width: 20%;
    text-align: left;
  }
  vscode-dropdown {
    width: 260px;
  }
  textarea {
    width: 260px;
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
