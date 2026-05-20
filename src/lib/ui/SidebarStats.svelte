<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { editorContent } from "$lib/editor/store"; 

  let words = 0;
  let sessionMinutes = 0;
  let wpm = 0;
  let timer: any;

  // Reactively calculate words when content changes
  $: words = $editorContent.trim() ? $editorContent.trim().split(/\s+/).length : 0;
  
  // Reactively calculate WPM 
  $: wpm = sessionMinutes > 0 ? Math.round(words / sessionMinutes) : words;

  onMount(() => {
    timer = setInterval(() => {
      sessionMinutes += 1;
    }, 60000); 
  });
  
  onDestroy(() => clearInterval(timer));
</script>

<div class="stats">
  <span>WPM {wpm}</span>
  <span>·</span>
  <span>Words {words}</span>
  <span>·</span>
  <span>Session {sessionMinutes}m</span>
</div>

<style>
.stats {
  color: var(--text-muted); /* Theme Variable */
  font-size: 14px;
  font-family: "Tw Cen MT", sans-serif;
  user-select: none;
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
  transition: color 0.4s ease;
}
</style>