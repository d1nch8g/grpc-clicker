<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";
  import Testing from "./Testing.svelte";
  import Info from "./Info.svelte";
  import Headers from "./Headers.svelte";

  $: data = {
    path: ``,
    protoName: ``,
    service: ``,
    call: ``,
    callTag: ``,
    inputMessageTag: ``,
    inputMessageName: ``,
    outputMessageName: ``,
    host: {
      adress: ``,
      plaintext: false,
    },
    json: "",
    maxMsgSize: 0,
    code: "",
    response: "",
    time: 0,
    date: "",
    headers: [],
    hosts: [],
    expectedResponse: "",
    expectedCode: "",
    expectedTime: 0,
  };

  window.addEventListener("message", (event) => {
    data = JSON.parse(`${event.data}`);
    console.log(`Webview created with parameters: `, data);
  });

  function onChange(data) {
    console.log(`webview data chaged:`, data);
    vscode.postMessage({
      command: "change",
      text: JSON.stringify(data),
    });
  }
  $: onChange(data);

  function onSend() {
    console.log(`Requst send triggered.`);
    data.response = "... processing";
    vscode.postMessage({
      command: "send",
    });
  }

  function onExport() {
    console.log(`Request export triggered.`);
    vscode.postMessage({
      command: "export",
    });
  }

  function onTest() {
    console.log(`Request test triggered.`);
    vscode.postMessage({
      command: "test",
    });
  }
</script>

<TopPanel bind:data onSend="{onSend}" onExport="{onExport}" />

<table>
  <td class="left-side">
    <div>
      <vscode-panels>
        <vscode-panel-tab id="tab-1">INPUT</vscode-panel-tab>
        <vscode-panel-tab id="tab-2">HEADERS</vscode-panel-tab>
        <vscode-panel-tab id="tab-3">INFORMATION</vscode-panel-tab>
        <vscode-panel-view id="view-1">
          <Headers bind:data />
        </vscode-panel-view>
        <vscode-panel-view id="view-2">
          <Request bind:data />
        </vscode-panel-view>
        <vscode-panel-view id="view-3">
          <Info bind:data />
        </vscode-panel-view>
      </vscode-panels>
    </div>
  </td>
  <td class="right-side">
    <div>
      <vscode-panels>
        <vscode-panel-tab id="tab-1">OUTPUT</vscode-panel-tab>
        <vscode-panel-tab id="tab-2">TESTING</vscode-panel-tab>
        <vscode-panel-view id="view-1">
          <Response bind:data />
        </vscode-panel-view>
        <vscode-panel-view id="view-2">
          <Testing bind:data createTest="{onTest}" />
        </vscode-panel-view>
      </vscode-panels>
    </div>
  </td>
</table>

<style>
  table {
    width: 100%;
  }
  td {
    height: 100%;
    width: 50%;
  }
  .left-side {
    padding-left: 3%;
    padding-right: 1%;
  }
  .right-side {
    padding-right: 3%;
    padding-left: 1%;
  }
</style>
