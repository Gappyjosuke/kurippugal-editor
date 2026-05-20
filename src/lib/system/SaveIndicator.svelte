<script lang="ts">
  import { isSavingStore } from "./appStore";
</script>

{#if $isSavingStore !== ""}
  <div class="save-indicator">
    <div class="spin-box">■</div>
    <span>{$isSavingStore}</span>
  </div>
{/if}

<style>
  .save-indicator {
    position: fixed;
    bottom: 42px;
    right: 42px;
    background: var(--page-bg);
    color: var(--text-main);
    border: 1px solid var(--text-main);
    padding: 12px 24px;
    font-family: "Tw Cen MT", sans-serif;
    font-size: 14px;
    letter-spacing: 0.15em;
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 9999999;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.15);
    
    /* Subtle fade in */
    animation: fadeIn 0.2s ease-out;
  }

  .spin-box {
    font-size: 12px;
    animation: spin 1s linear infinite;
    transform-origin: center;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>