<script>
  import TopPanel from "./TopPanel.svelte";
  import Request from "./Request.svelte";
  import Response from "./Response.svelte";
  let input = {
    proto: "petstore",
    version: "v1",
    adress: "val",
    call: "GetPet",
    tls: false,
    stream: false,
    requestName: "Pet",
    requestRepresentation: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "age",
        type: "int32",
      },
    ],
    responseName: "Pet",
    responseRepresentation: [
      {
        name: "string",
        type: "int32",
      },
    ],
    meta: ["username: user", "password: pass"],
  };
</script>

<div class="top-container">
  <TopPanel />
</div>

<hr class="solid" />

<table>
  <tr>
    <td class="left">
      <Request />
    </td>

    <td>
      <Response />
    </td>
  </tr>
</table>

<style>
  .top-container {
    padding-top: 2%;
    padding-left: 6%;
    padding-right: 6%;
  }

  .solid {
    border-top: 0.5px solid;
    margin-left: 3%;
    margin-right: 3%;
    margin-top: 1%;
    margin-bottom: 1%;
  }

  table {
    width: 100%;
  }

  td,
  tr {
    height: 100%;
    width: 50%;
  }

  td.left {
    border-right: 1px solid;
  }
</style>
