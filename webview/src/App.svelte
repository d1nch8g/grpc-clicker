<script>
  import TopPanel from "./TopPanel.svelte";
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

<div class="container">
  <TopPanel />
</div>

<style>
  .container {
    padding-top: 2%;
    padding-left: 6%;
    padding-right: 6%;
  }
</style>
