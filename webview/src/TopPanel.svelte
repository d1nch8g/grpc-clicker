<script>
  export let proto = "petstore";
  export let version = "v1";
  export let service = "petstore";
  export let call = "call";
  export let adress = "http://localhost:12201";
  export let onClick;
</script>

<div class="top-container">
  <table>
    <tr>
      <th>proto</th>
      <td>{proto}</td>
      <th>service</th>
      <td>{service}</td>
      <td class="expanded">
        <input type="text" name="" id="" value="{adress}" readonly />
      </td>
    </tr>
    <tr>
      <th>version</th>
      <td>{version}</td>
      <th>call</th>
      <td>{call}</td>
      <td>
        <center> <button on:click="{onClick}">SEND</button></center>
      </td>
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
  .expanded {
    width: 100%;
    padding-left: 8px;
    padding-right: 8px;
  }
  input {
    padding-top: 4px;
    padding-bottom: 4px;
    padding: 1.5px;
  }
  button {
    padding-top: 4px;
    padding-bottom: 4px;
  }
</style>
