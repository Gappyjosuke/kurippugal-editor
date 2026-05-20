<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { editorContent } from "./store";
  import { menuStore } from "$lib/system/menuStore";
  import { initializeInputController } from "$lib/system/inputController";
  import { activeModesStore } from "$lib/system/modeEngine";

  let editorElement: HTMLDivElement;
  let currentTime = "";
  let interval: any;

  /* AUTO-FOCUS ENGINE */
  $: if (!$menuStore.isOpen && editorElement) {
    setTimeout(() => {
      editorElement.focus();
    }, 10);
  }

  function handleInput() {
    if (!editorElement) return;
    const content = editorElement.innerHTML;
    editorContent.set(content);
    localStorage.setItem("kurippugal-document", content);
  }

  onMount(() => {
    initializeInputController();
    const saved = localStorage.getItem("kurippugal-document");
    if (saved && editorElement) {
      editorElement.innerHTML = saved;
    }
    
    // Live Time Clock
    interval = setInterval(() => {
      const now = new Date();
      currentTime = now.toLocaleTimeString('en-US', { hour12: false }) + " // " + now.toLocaleDateString();
    }, 1000);
  });
  
  onDestroy(() => clearInterval(interval));
</script>

<div class="system-status-bar">
  <span class="status-label">SYS.MODE //</span>
  
  <div class="status-tags">
    {#if $activeModesStore.size > 0}
      {#each Array.from($activeModesStore) as mode}
        <span class="status-tag">[ {mode} ]</span>
      {/each}
    {:else}
      <span class="status-tag empty-tag">[ DEFAULT ]</span>
    {/if}
  </div>
  
  <span class="status-label" style="margin-left: auto;">{currentTime}</span>
</div>

<div
  bind:this={editorElement}
  class="editor"
  contenteditable="true"
  spellcheck="false"
  role="textbox"
  tabindex="0"
  on:input={handleInput}
></div>

<style>
.system-status-bar {
    /* FIX: No longer sticky. It is locked permanently above the text. */
    position: relative;
    width: 100%;
    flex-shrink: 0; /* Prevents the header from squishing */
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px dashed var(--border-color, rgba(80, 70, 55, 0.2));
    background: transparent; /* No longer needs to hide text */
    z-index: 10;
    transition: border-color 0.5s ease;
  }
  .status-label {
    font-family: "Vintage ROM", monospace;
    font-size: 10px;
    color: var(--text-muted);
    letter-spacing: 0.15em;
    transition: color 0.5s ease;
  }

  .status-tags {
    display: flex;
    gap: 8px;
  }

  .status-tag {
    background: var(--text-main);
    color: var(--page-bg);
    padding: 2px 8px;
    font-family: "Vintage ROM", monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    border-left: 3px solid var(--page-bg);
    transition: background 0.5s ease, color 0.5s ease, border-color 0.5s ease;
  }

  .empty-tag {
    background: transparent;
    color: var(--text-muted);
    border-left: 1px solid var(--text-muted);
    opacity: 0.5;
  }

.editor {
    width: 100%;
    
    /* FIX: The text editor now fills the rest of the space and scrolls internally! */
    flex-grow: 1;
    overflow-y: auto; 
    overflow-x: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    
    padding-top: 24px;
    padding-bottom: 100px; 
    outline: none;
    color: var(--text-main);
    font-size: 18px;
    line-height: 1.85;
    font-family: var(--editor-font, "Fira Mono", monospace);
    font-weight: 500;
    letter-spacing: 0.02em;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    caret-color: var(--text-muted);
    tab-size: 4;
    transition: color 0.5s ease;
  }

  .editor::selection {
    background: var(--highlight-bg);
    color: var(--text-main);
  }

  .editor::-webkit-scrollbar {
    display: none;
  }

  :global(.editor blockquote) {
    border-left: 3px solid var(--text-main);
    padding-left: 14px;
    margin-left: 0;
    font-style: italic;
    opacity: 0.85;
  }

  :global(.editor blockquote::before) {
    content: '"';
    font-size: 1.5em;
    font-family: "Vintage ROM", monospace;
    margin-right: 4px;
  }

/* OVERRIDE DEFAULT HTML SPACING */
  :global(.editor h1),
  :global(.editor h2),
  :global(.editor h3) {
    margin: 0 0 12px 0; /* Kills the giant top margin */
    padding: 0;
    font-weight: bold;
    line-height: 1.3;
    color: inherit;
  }

  /* Set exact, cohesive sizes */
  :global(.editor h1) { font-size: 24px; }
  :global(.editor h2) { font-size: 20px; }
  :global(.editor h3) { font-size: 16px; }

  /* Normal text */
  :global(.editor p), :global(.editor div) {
    margin: 0 0 8px 0;
    font-size: 16px; 
    line-height: 1.7;
  }



</style>