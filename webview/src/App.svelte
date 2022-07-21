<script>
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

<div class="row">
  <div class="column left">
    <h2>Metadata</h2>

    <table>
      <th>Call info</th>
      <tr>
        <td>Proto </td>
        <td>{input.proto} </td>
      </tr>
      <tr>
        <td>Version </td>
        <td>{input.proto} </td>
      </tr>
      <tr>
        <td>Adress </td>
        <td>{input.adress} </td>
      </tr>
      <tr>
        <td>Service </td>
        <td>{input.call} </td>
      </tr>
      <tr>
        <td>Call </td>
        <td>{input.call} </td>
      </tr>
    </table>

    <table>
      <th>Input message</th>
      {#each input.requestRepresentation as { name, type }, i}
        <tr>
          <td>
            {type}
            {name}
          </td>
        </tr>
      {/each}
    </table>

    <table>
      <th>Output message</th>
      {#each input.responseRepresentation as { name, type }, i}
        <tr>
          <td>
            {type}
            {name}
          </td>
        </tr>
      {/each}
    </table>

    <table>
      <tr>
        <th>Metadata</th>
      </tr>
      {#each input.meta as elem, i}
        <tr>
          <td>
            {elem}
          </td>
        </tr>
      {/each}
    </table>
  </div>

  <div class="column middle">
    <h2>Request</h2>
    <p>Some text..</p>
  </div>

  <div class="column right">
    <h2>Response</h2>
    <p>Some text..</p>
  </div>
</div>

<style>
  th {
    text-align: center;
  }
  h2 {
    width: 100%;
    text-align: center;
  }

  table {
    text-align: center;
    position: relative;
    border-collapse: collapse;
    width: 100%;
    margin: 2px;
  }

  td {
    border: 1px solid #999;
    padding: 20px;
  }

  * {
    box-sizing: border-box;
  }

  .column {
    float: left;
    padding: 10px;
    height: 800px;
  }

  .left {
    min-width: 20%;
    border-right: 1px solid #6e6e6e;
  }
  .right {
    min-width: 20%;
  }
  .middle {
    min-width: 30%;
    border-right: 1px solid #6e6e6e;
  }
</style>
