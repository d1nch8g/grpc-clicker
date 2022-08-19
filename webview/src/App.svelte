<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";
  import Testing from "./Testing.svelte";
  import Info from "./Info.svelte";

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
    metadata: [],
    hosts: [],
    expectedResponse: "",
    expectedCode: "",
    expectedTime: 0,
  };

  window.addEventListener("message", (event) => {
    data = JSON.parse(`${event.data}`);
  });

  function onSend() {
    data.response = "... processing";
    vscode.postMessage({
      command: "send",
    });
  }

  function onEditRequest(text) {
    vscode.postMessage({
      command: "edit",
      text: text,
    });
  }
  $: onEditRequest(data.json);

  function onExport() {
    vscode.postMessage({
      command: "export",
    });
  }

  function onHost(host) {
    vscode.postMessage({
      command: "host",
      text: JSON.stringify(host),
    });
  }

  function onEditResponse(text) {
    if (text === ``) {
      text = undefined;
    }
    vscode.postMessage({
      command: "expectedResponse",
      text: text,
    });
  }
  $: onEditResponse(data.expectedResponse);

  function onCreateTest() {
    if (data.expectedCode === ``) {
      data.expectedCode = `OK`;
    }
    if (data.expectedTime === 0) {
      data.expectedTime = 0.1;
    }
    if (data.expectedResponse === undefined || data.expectedResponse === ``) {
      data.expectedResponse = undefined;
    }
    vscode.postMessage({
      command: "test",
      text: JSON.stringify(data),
    });
  }
</script>

<TopPanel
  data="{data}"
  onSend="{onSend}"
  onExport="{onExport}"
  onHost="{onHost}"
/>

<table>
  <td class="left-side">
    <div>
      <vscode-panels>
        <vscode-panel-tab id="tab-1">INPUT</vscode-panel-tab>
        <vscode-panel-tab id="tab-2">INFORMATION</vscode-panel-tab>
        <vscode-panel-view id="view-1">
          <Request bind:data />
        </vscode-panel-view>
        <vscode-panel-view id="view-2">
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
          <Testing bind:data createTest="{onCreateTest}" />
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
