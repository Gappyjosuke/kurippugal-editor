<script lang="ts">
  import { systemPromptStore } from "./appStore";

  let inputValue = "";

  function handleConfirm() {
    $systemPromptStore.onConfirm(inputValue);
    closePrompt();
  }

  function closePrompt() {
    systemPromptStore.set({ isOpen: false, type: "confirm", message: "", onConfirm: () => {} });
    inputValue = "";
  }
</script>

{#if $systemPromptStore.isOpen}
  <div class="prompt-overlay">
    <div class="prompt-box">
      <div class="prompt-header">
        <span class="square">■</span> SYSTEM MESSAGE
      </div>
      
      <div class="prompt-body">
        <p class="message-text">{$systemPromptStore.message}</p>
        
        {#if $systemPromptStore.type === "input"}
          <!-- svelte-ignore a11y_autofocus -->
          <input 
            type="text" 
            bind:value={inputValue} 
            placeholder="https://..." 
            autofocus 
          />
        {/if}
      </div>

      <div class="prompt-actions">
        <button on:click={handleConfirm}>
          <span class="cursor-pointer"></span>
          <span class="square">■</span> Yes
        </button>
        
        <button on:click={closePrompt}>
          <span class="square">■</span> No
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .prompt-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999999;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
  }

  .prompt-box {
    width: 480px;
    background: #cdc8b0; /* NieR paper color */
    border: 1px solid rgba(80, 75, 60, 0.4);
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.15);
    
    /* The NieR Grid Background */
    background-image: 
      linear-gradient(rgba(80, 75, 60, 0.1) 1px, transparent 1px), 
      linear-gradient(90deg, rgba(80, 75, 60, 0.1) 1px, transparent 1px);
    background-size: 8px 8px;
    
    animation: popup 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  @keyframes popup {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  /* HEADER */
  .prompt-header {
    background: #4a473b;
    color: #d7d3b0;
    padding: 8px 16px;
    font-family: "Tw Cen MT", sans-serif;
    font-size: 16px;
    letter-spacing: 0.15em;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* BODY */
  .prompt-body {
    padding: 24px 32px;
    color: #2f2b24;
    border-bottom: 1px solid rgba(80, 75, 60, 0.2);
  }

  .message-text {
    font-family: "Fira Mono", monospace;
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
    white-space: pre-wrap; /* Allows line breaks (\n) in messages */
  }

  input {
    width: 100%;
    margin-top: 20px;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid #4a473b;
    outline: none;
    font-family: "Fira Mono", monospace;
    font-size: 14px;
    color: #2f2b24;
  }
  
  input:focus {
    background: rgba(255, 255, 255, 0.9);
    border-color: #2f2b24;
  }

  /* ACTIONS */
  .prompt-actions {
    display: flex;
    justify-content: center;
    gap: 48px;
    padding: 20px;
  }

  button {
    background: #4a473b;
    color: #d7d3b0;
    border: none;
    padding: 8px 32px;
    font-family: "Tw Cen MT", sans-serif;
    font-size: 16px;
    letter-spacing: 0.08em;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.1s;
    position: relative;
  }

  button:hover {
    background: #2f2b24;
  }

  /* Squares used for icons */
  .square {
    font-size: 10px;
    transform: translateY(-1px);
  }

  /* The little arrow pointer on the Yes button (like the screenshot) */
  .cursor-pointer {
    position: absolute;
    left: -24px;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 10px solid #2f2b24;
    opacity: 0;
  }

  button:hover .cursor-pointer {
    opacity: 1;
  }
</style>