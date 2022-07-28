<script>
  export let proto = "petstore";
  export let version = "v1";
  export let service = "petstore";
  export let call = "call";
  export let host = "http://localhost:12201";
  export let onClick;
</script>

<div class="top-container">
  <table>
    <tr>
      <td>{proto}</td>
      <td>{version}</td>
      <td>{service}</td>
      <td>{call}</td>
      <td class="expanded">
        <input type="text" name="" id="" value="{host}" readonly />
      </td>
      <td><vscode-button on:click="{onClick}">Send</vscode-button></td>
    </tr>
  </table>
</div>

<style>
  .top-container {
    padding-top: 1%;
    padding-left: 6%;
    padding-right: 6%;
  }
  table {
    margin: 4px;
    border: 1px solid;
    border-collapse: collapse;
  }
  td,
  th {
    margin: 6px;
    padding: 6px;
    border: 1px solid;
    border-collapse: collapse;
  }
  input {
    padding-top: 4px;
    padding-bottom: 4px;
    padding: 1.5px;
  }
  .expanded {
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
