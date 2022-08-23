<script>
  import { shortcut } from "./shortcut.js";
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";
  import Info from "./Info.svelte";
  import Testing from "./Testing.svelte";
  import Headers from "./Headers.svelte";

  $: data = {
    request: {
      file: {
        type: "FILE",
        filePath: "server/api.proto",
        importPath: "/",
      },
      content: "{}",
      server: {
        type: "SERVER",
        host: "localhost:8080",
        plaintext: true,
      },
      callTag: "pb.v1.Constructions/AnyCall",
      maxMsgSize: 4,
      headers: [],
    },
    info: {
      service: "pb.v1.Constructions",
      call: "AnyCall",
      inputMessageTag: ".google.protobuf.Any",
      inputMessageName: "Any",
      outputMessageName: "Any",
      protoPackage: "pb.v1",
    },
    headers: [],
    hosts: {
      current: "localhost:8080",
      plaintext: true,
      hosts: [],
    },
    response: {
      date: "",
      time: 0,
      code: "OK",
      content: "",
    },
    expectations: {
      code: "OK",
      time: 0,
      content: "",
    },
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
    data.response.content = `... processing`;
    vscode.postMessage({
      command: "send",
    });
  }

  function onHosts() {
    console.log(`Requst send triggered.`);
    vscode.postMessage({
      command: "hosts",
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

  function onAddHeader() {
    console.log(`Header adding triggered.`);
    vscode.postMessage({
      command: "addHeader",
    });
  }

  function onRemoveHeader() {
    console.log(`Hedaer removal triggered.`);
    vscode.postMessage({
      command: "removeHeader",
    });
  }

  function onSave() {
    console.log(`Save triggered`);
    let asJson = JSON.parse(data.request.content);
    data.request.content = JSON.stringify(asJson, null, 2) + `\n`;
  }
</script>

<svelte:window
  use:shortcut="{{
    control: true,
    code: 'KeyS',
    callback: onSave,
  }}"
  use:shortcut="{{
    control: true,
    code: 'Enter',
    callback: onSend,
  }}"
/>

<TopPanel
  bind:data
  onSend="{onSend}"
  onExport="{onExport}"
  onHosts="{onHosts}"
/>

<table>
  <td class="left-side">
    <div>
      <vscode-panels>
        <vscode-panel-tab id="tab-1">INPUT</vscode-panel-tab>
        <vscode-panel-tab id="tab-2">HEADERS</vscode-panel-tab>
        <vscode-panel-tab id="tab-3">INFORMATION</vscode-panel-tab>
        <vscode-panel-view id="view-1">
          <Request bind:data />
        </vscode-panel-view>
        <vscode-panel-view id="view-2">
          <Headers
            bind:data
            addHeader="{onAddHeader}"
            removeHeader="{onRemoveHeader}"
          />
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
