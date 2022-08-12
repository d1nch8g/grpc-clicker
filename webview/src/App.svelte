<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";

  $: requestData = {
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
    time: "",
    date: "",
    metadata: [],
    hosts: [],
    expectedResponse: "",
    expectedCode: "",
    expectedTime: "",
  };

  window.addEventListener("message", (event) => {
    requestData = JSON.parse(`${event.data}`);
  });

  function onSend() {
    requestData.response = "waiter";
    vscode.postMessage({
      command: "send",
    });
  }

  function onEditRequest() {
    vscode.postMessage({
      command: "edit",
      text: requestData.json,
    });
  }

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
</script>

<TopPanel
  requestData="{requestData}"
  onSend="{onSend}"
  onExport="{onExport}"
  onHost="{onHost}"
/>

<table>
  <td>
    <Request bind:requestData edit="{onEditRequest}" />
  </td>
  <td>
    <Response bind:requestData />
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
</style>
