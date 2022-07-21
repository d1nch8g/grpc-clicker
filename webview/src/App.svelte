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
        name: "string",
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
      <tr>
        <td>Input message</td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Output message</td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Metadata</td>
      </tr>
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
  h2 {
    width: 100%;
    text-align: center;
  }

  table {
    text-align: center;
    position: relative;
    border-collapse: collapse;
    width: 100%;
    margin: 8px;
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
    width: 20%;
    border-right: 1px solid #6e6e6e;
  }
  .right {
    width: 40%;
  }
  .middle {
    width: 40%;
    border-right: 1px solid #6e6e6e;
  }
</style>
