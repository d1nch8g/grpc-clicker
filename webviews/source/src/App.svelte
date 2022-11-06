<script>
  $: data = {
    source: {
      type: "FILE",
      filePath: "server/api.proto",
      importPath: "/",
      host: "localhost",
      plaintext: true,
      servername: "",
      timeout: 0.5,
      unix: false,
    },
  };

  window.addEventListener("message", (event) => {
    data = JSON.parse(`${event.data}`);
    console.log(`Webview created with parameters: `, data);
  });
</script>

{#if data.source.type === `FILE`}
  <table class="main">
    <tr>
      <h1>New proto file source</h1>
    </tr>
    <tr>
      <vscode-divider></vscode-divider>
    </tr>
    <tr>
      <h4>some stuff...</h4>
    </tr>
  </table>
{:else}
  <table>
    <tr>
      <center>
        <h1>New proto reflect server</h1>
      </center>
    </tr>
    <tr>
      <vscode-divider></vscode-divider>
    </tr>
  </table>

  <table>
    <th class="left">
      <h4>Server adress</h4>
      <h5>Connection adress, typically in host:port format.</h5>
    </th>
    <th class="right">
      <textarea
        bind:value="{data.source.host}"
        rows="1"
        oninput="this.value = this.value.replace(/\n/g,'')"></textarea>
    </th>
  </table>

  <table>
    <th class="left">
      <h4>Connection timeout (seconds)</h4>
      <h5>
        The maximum time, in seconds, to wait for connection to be established.
        Defaults to 0.5 seconds.
      </h5>
    </th>
    <th class="right">
      <textarea
        bind:value="{data.source.timeout}"
        rows="1"
        oninput="this.value = this.value.replace(/\n/g,'')"></textarea>
    </th>
  </table>

  <table>
    <th class="left">
      <h4>Server name</h4>
      <h5>Override server name when validating TLS certificate.</h5>
    </th>
    <th class="right">
      <textarea
        bind:value="{data.source.servername}"
        rows="1"
        oninput="this.value = this.value.replace(/\n/g,'')"></textarea>
    </th>
  </table>

  <table>
    <th class="left">
      <h4>Use plaintext</h4>
      <h5>Use plain-text HTTP/2 when connecting to server (no TLS).</h5>
    </th>
    <th class="right">
      <vscode-dropdown>
        <vscode-option on:click="{(data.source.plaintext = true)}">
          <div>Yes</div>
        </vscode-option>
        <vscode-option on:click="{(data.source.plaintext = false)}">
          <div>No</div>
        </vscode-option>
      </vscode-dropdown>
    </th>
  </table>

  <table>
    <th class="left">
      <h4>Unix path</h4>
      <h5>Unix variants, the address must be the path to the domain socket.</h5>
    </th>
    <th class="right">
      <vscode-dropdown>
        <vscode-option on:click="{(data.source.plaintext = true)}">
          <div>No</div>
        </vscode-option>
        <vscode-option on:click="{(data.source.plaintext = false)}">
          <div>Yes (the address must be the path to the domain socket)</div>
        </vscode-option>
      </vscode-dropdown>
    </th>
  </table>

  <table>
    <th class="left">
      <h4>Insecure</h4>
      <h5>
        Skip server certificate and domain verification. (NOT SECURE!) Not valid
        with -plaintext option.
      </h5>
    </th>
    <th class="right">
      <vscode-dropdown>
        <vscode-option on:click="{(data.source.plaintext = false)}">
          <div>No</div>
        </vscode-option>
        <vscode-option on:click="{(data.source.plaintext = true)}">
          <div>Yes</div>
        </vscode-option>
      </vscode-dropdown>
    </th>
  </table>
{/if}

<style>
  vscode-dropdown {
    width: 100%;
    margin-top: -5px;
  }
  table {
    padding-left: 15%;
    padding-right: 15%;
    width: 100%;
  }
  .left {
    width: 30%;
  }
  .right {
    width: 70%;
    margin-top: 100px;
  }
  textarea {
    resize: none;
    white-space: nowrap;
    width: 100%;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
    caret-color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-sideBar-background);
    pointer-events: auto;
    outline-color: var(--vscode-focusBorder) !important;
    color: var(--vscode-foreground);
  }
</style>
