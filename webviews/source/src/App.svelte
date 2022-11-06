<script>
  $: data = {
    source: {
      type: "FILE",
      filePath: "server/api.proto",
      importPath: "/",
      timeout: 0.5,
      filePath: `.`,
      importPath: `.`,
    },
  };

  window.addEventListener("message", (event) => {
    data = JSON.parse(`${event.data}`);
    console.log(`Webview created with parameters: `, data);
  });
</script>

{#if data.source.type === `FILE`}
  <table>
    <tr>
      <h1>New proto file source</h1>
    </tr>
    <tr>
      <vscode-divider></vscode-divider>
    </tr>
    <tr>
      <h2>some stuff...</h2>
    </tr>
  </table>
{:else}
  <table>
    <tr>
      <h1>New proto reflect server</h1>
    </tr>
    <tr>
      <vscode-divider></vscode-divider>
    </tr>
    <tr>
      <h2>Server adress</h2>
    </tr>
    <tr>
      
    </tr>
  </table>
{/if}

<style>
  table {
    padding-left: 15%;
    padding-right: 15%;
  }
</style>
