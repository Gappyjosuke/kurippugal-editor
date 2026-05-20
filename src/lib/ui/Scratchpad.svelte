<script lang="ts">
  import { scratchpadStore } from "$lib/system/appStore";
</script>

<textarea
  placeholder="// quick scribbles ..."
  bind:value={$scratchpadStore}
></textarea>

<style>
  textarea {
    width: 210px;
    height: 250px;
    background: var(--page-bg);
    color: var(--text-main);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border-color);
    outline: none;
    resize: none;
    padding: 16px;
    font-size: 14px;
    font-family: "Tw Cen MT", sans-serif;
    border-radius: 16px;
    transition: background 0.4s ease, border-color 0.4s ease, transform 0.25s ease, color 0.4s ease;
  }

  textarea::placeholder {
    font-family: "Tw Cen MT", sans-serif;
    color: var(--text-muted);
  }

  textarea:hover {
    filter: brightness(1.05); /* Works for both light and dark mode */
    border-color: var(--text-muted);
    transform: translateY(-2px);
  }
</style>