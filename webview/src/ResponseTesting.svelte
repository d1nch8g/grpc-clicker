<script>
  export let data;
  $: innerHeight = 0;
</script>

<svelte:window bind:innerHeight />

<textarea
  class="code"
  name=""
  id=""
  cols="30"
  rows="10"
  bind:value="{data.expectedTime}"
  readonly></textarea>

<style>
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
  }
  textarea:focus {
    outline-color: var(--vscode-focusBorder) !important;
  }
</style>
