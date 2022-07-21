<script lang="ts">
  let protoName = "petstore";
  let protoVersion = "v1";
  let protoAdress = "localhost:8080";
  let serviceName = "PetSerivce";
  let protoCallName = "GetPets";
  let inputRepresentation = `reqs = 1`;
  let outputRepresentation = `reqs = 1`;
</script>

<div class="row">
  <div class="column left">
    <h2>Metadata</h2>

    <table>
      <tr>
        <td>Proto </td>
        <td>{protoName} </td>
      </tr>
      <tr>
        <td>Version </td>
        <td>{protoVersion} </td>
      </tr>
      <tr>
        <td>Adress </td>
        <td>{protoAdress} </td>
      </tr>
      <tr>
        <td>Service </td>
        <td>{serviceName} </td>
      </tr>
      <tr>
        <td>Call </td>
        <td>{protoCallName} </td>
      </tr>
      <tr>
        <td>Call </td>
        <td>{protoCallName} </td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Input message</td>
      </tr>
      <tr>
        <td>{inputRepresentation} </td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Output message</td>
      </tr>
      <tr>
        <td>{outputRepresentation} </td>
      </tr>
    </table>

    <table>
      <tr>
        <td>Metadata</td>
      </tr>
      <tr>
        <td>{outputRepresentation} </td>
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
    height: 800px; /* Should be removed. Only for demonstration */
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
