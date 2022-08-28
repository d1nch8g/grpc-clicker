<script>
  import { shortcut } from "./shortcut.js";
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";
  import Info from "./Info.svelte";
  import Testing from "./Testing.svelte";
  import Headers from "./Headers.svelte";
  import Snippet from "./Snippet.svelte";

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
    hosts: [],
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
    console.log(`Host modifications activated.`);
    vscode.postMessage({
      command: "hosts",
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

  function onSnippet() {
    console.log(`Snippet generation activated.`);
    vscode.postMessage({
      command: "snippet",
    });
  }

  $: innerHeight = 0;
  $: innerWidth = 0;
  $: horizontalOrientation = innerHeight < innerWidth;
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
  bind:innerHeight
  bind:innerWidth
/>

<TopPanel bind:data onSend="{onSend}" onHosts="{onHosts}" />

<table>
  {#if horizontalOrientation}
    <td class="horizontal">
      <div>
        <vscode-panels>
          <vscode-panel-tab id="tab-1">REQUEST</vscode-panel-tab>
          <vscode-panel-tab id="tab-2">HEADERS</vscode-panel-tab>
          <vscode-panel-tab id="tab-3">SNIPPET</vscode-panel-tab>
          <vscode-panel-tab id="tab-4">INFORMATION</vscode-panel-tab>
          <vscode-panel-view id="view-1">
            <Request bind:data height="{innerHeight - 165}" />
          </vscode-panel-view>
          <vscode-panel-view id="view-2">
            <Headers
              bind:data
              addHeader="{onAddHeader}"
              removeHeader="{onRemoveHeader}"
              height="{innerHeight - 135}"
            />
          </vscode-panel-view>
          <vscode-panel-view id="view-3">
            <Snippet
              bind:data
              onSnippet="{onSnippet}"
              height="{innerHeight - 220}"
            />
          </vscode-panel-view>
          <vscode-panel-view id="view-4">
            <Info bind:data height="{innerHeight - 135}" />
          </vscode-panel-view>
        </vscode-panels>
      </div>
    </td>
    <td class="horizontal">
      <div>
        <vscode-panels>
          <vscode-panel-tab id="tab-1">RESPONSE</vscode-panel-tab>
          <vscode-panel-tab id="tab-2">TESTING</vscode-panel-tab>
          <vscode-panel-view id="view-1">
            <Response bind:data height="{innerHeight - 165}" />
          </vscode-panel-view>
          <vscode-panel-view id="view-2">
            <Testing
              bind:data
              createTest="{onTest}"
              height="{innerHeight - 285}"
            />
          </vscode-panel-view>
        </vscode-panels>
      </div>
    </td>
  {:else}
    <tr>
      <vscode-panels>
        <vscode-panel-tab id="tab-1">REQUEST</vscode-panel-tab>
        <vscode-panel-tab id="tab-2">HEADERS</vscode-panel-tab>
        <vscode-panel-tab id="tab-3">SNIPPET</vscode-panel-tab>
        <vscode-panel-tab id="tab-4">INFORMATION</vscode-panel-tab>
        <vscode-panel-view id="view-1">
          <Request bind:data height="{innerHeight / 2 - 122}" />
        </vscode-panel-view>
        <vscode-panel-view id="view-2">
          <Headers
            bind:data
            addHeader="{onAddHeader}"
            removeHeader="{onRemoveHeader}"
            height="{innerHeight / 2 - 92}"
          />
        </vscode-panel-view>
        <vscode-panel-view id="view-3">
          <Snippet
            bind:data
            onSnippet="{onSnippet}"
            height="{innerHeight / 2 - 184}"
          />
        </vscode-panel-view>
        <vscode-panel-view id="view-4">
          <Info bind:data height="{innerHeight / 2 - 92}" />
        </vscode-panel-view>
      </vscode-panels>
    </tr>
    <tr>
      <vscode-panels>
        <vscode-panel-tab id="tab-1">RESPONSE</vscode-panel-tab>
        <vscode-panel-tab id="tab-2">TESTING</vscode-panel-tab>
        <vscode-panel-view id="view-1">
          <Response bind:data height="{innerHeight / 2 - 122}" />
        </vscode-panel-view>
        <vscode-panel-view id="view-2">
          <Testing
            bind:data
            createTest="{onTest}"
            height="{innerHeight / 2 - 252}"
          />
        </vscode-panel-view>
      </vscode-panels>
    </tr>
  {/if}
</table>

<style>
  table {
    width: 100%;
    height: var(--height);
  }
  td {
    height: 100%;
    width: 50%;
  }
  .horizontal {
    padding-left: 1.5%;
    padding-right: 1.5%;
  }
</style>
