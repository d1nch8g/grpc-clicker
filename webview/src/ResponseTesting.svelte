<script>
  export let data;
  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<table>
  <tr>
    <td>
      <h3>EXPECTED TIME</h3>
    </td>
    <td>
      <textarea name="" id="" cols="1" bind:value="{data.expectedTime}"
      ></textarea>
    </td>
  </tr>
</table>

<style>
  table {
    width: 100%;
  }
  textarea {
    height: var(--height);
    resize: none;
    display: block;
    width: 100%;
    color: var(--vscode-input-foreground);
    outline-color: var(--vscode-input-border);
    background-color: var(--vscode-input-background);
    padding: 6px;
    font-family: var(--vscode-editor-font-family);
    font-size: var(--vscode-editor-font-size);
    height: 18px;
  }
  textarea:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
</style>
