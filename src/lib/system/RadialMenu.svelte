<script lang="ts">
  import { menuStore } from "./menuStore";
  import { MENU_TREE } from "./menuTree";
  import { getModeTags } from "./modeEngine";
  
  // 1. NEW: Import the error trigger from our input controller
  import { menuErrorTrigger } from "./inputController"; 

  // Check if an item is active in the typing engine
  function isModeActive(mode?: string) {
    if (!mode) return false;
    return getModeTags().includes(mode);
  }

  // Flatten the root items into a single vertical list.
  const rootNodes:any[] = [
    MENU_TREE.find((n) => n.direction === "UP"),    // [ System ]
    MENU_TREE.find((n) => n.direction === "LEFT"),  // [ Structure ]
    MENU_TREE.find((n) => n.direction === "RIGHT"), // [ Style ]
    MENU_TREE.find((n) => n.direction === "DOWN"),  // [ Environment ]
    { label: "[ RESET ]", isReset: true, children: null } // Universal clear
  ].filter(Boolean); 

  // Get the nested submenus based on the current path
  function getMenuLevels() {
    return $menuStore.path.map((node) => node.children || []);
  }
</script>

{#if $menuStore.isOpen}
  <div class="overlay">
    <div class="scanlines"></div>

    <div class="menu-container">
      
      <div class="menu-column">
        {#each rootNodes as node, index}
          <div
            class="menu-item"
            class:active={$menuStore.path.length === 0 && index === $menuStore.submenuIndex}
            class:error-shake={$menuErrorTrigger && $menuStore.path.length === 0 && index === $menuStore.submenuIndex}
            class:error-pulse={$menuErrorTrigger}
          >
            <div class="menu-content">
              <span>{node.label}</span>
              {#if node.children}
                <span class="arrow">›</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      {#if $menuStore.path.length > 0}
        {#each getMenuLevels() as level, levelIndex}
          <div class="menu-column">
            {#each level as child, index}
              <div
                class="menu-item"
                class:active={levelIndex === $menuStore.path.length - 1 && index === $menuStore.submenuIndex}
                class:equipped={isModeActive(child.mode)}
                class:error-shake={$menuErrorTrigger && levelIndex === $menuStore.path.length - 1 && index === $menuStore.submenuIndex}
              >
                <div class="menu-content">
                  <span>{child.label}</span>
                  
                  {#if isModeActive(child.mode)}
                    <span class="confirm">■</span>
                  {:else if child.children}
                    <span class="arrow">›</span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/each}
      {/if}
      
    </div>
  </div>
{/if}

<style>
  /* GLOBAL OVERLAYS */
  .overlay {
    position: fixed; inset: 0; z-index: 999999; display: flex;
    justify-content: center; align-items: center; pointer-events: none;
    background: rgba(0, 0, 0, 0.06); backdrop-filter: blur(6px);
  }

  .scanlines {
    position: absolute; inset: 0; opacity: 0.03;
    background-image: repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 0px, rgba(0, 0, 0, 0.18) 1px, transparent 1px, transparent 4px);
  }

  /* FLEXBOX LAYOUT (The Magic Fix) */
  .menu-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 16px; /* Space between columns */
    transform: translateX(-10%); 
  }

  .menu-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
    animation: slideIn 150ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  /* INDIVIDUAL MENU ITEMS */
  .menu-item {
    width: 260px;
    padding: 14px 18px;
    background: #d7d3b0;
    color: #2f2b24;
    border-top: 1px solid #2f2b24;
    border-bottom: 1px solid #2f2b24;
    border-left: 5px solid #2f2b24;
    border-right: 5px solid #2f2b24;
    font-family: "Tw Cen MT", sans-serif;
    font-size: 15px;
    letter-spacing: 0.08em;
    transition: background 60ms linear, color 60ms linear, transform 50ms ease;
  }

/* INDIVIDUAL MENU ITEMS */
  .menu-item {
    width: 260px;
    padding: 14px 18px;
    background: var(--page-bg);
    color: var(--text-main);
    border: 1px solid var(--text-main);
    border-left: 5px solid var(--text-main);
    border-right: 5px solid var(--text-main);
    font-family: "Tw Cen MT", sans-serif;
    font-size: 15px;
    letter-spacing: 0.08em;
    transition: background 150ms linear, color 150ms linear, transform 50ms ease, border-color 150ms linear;
  }

  /* ACTIVE (Hovered via Keyboard) */
  .menu-item.active {
    background: var(--text-main);
    color: var(--page-bg);
  }

  /* EQUIPPED (Spacebar locked) */
  .menu-item.equipped {
    background: var(--highlight-bg); /* Uses the highlight variable */
  }

  .menu-item.active.equipped {
    background: var(--text-main);
  }

  .arrow {
    font-size: 18px;
    opacity: 0.6;
    line-height: 0;
  }

  .confirm {
    font-family: "Vintage ROM", monospace;
    font-size: 12px;
    color: currentColor;
  }

  /* PHYSICAL PRESS ANIMATION */
  :global(.pressed-anim) {
    transform: scale(0.95) !important;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* ERROR SHAKE ANIMATION */
  .error-shake {
    animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
    background: #7a2828 !important; /* Red flash */
    color: #fff !important;
  }

  @keyframes shake {
    10%, 90% { transform: translate3d(-1px, 0, 0); }
    20%, 80% { transform: translate3d(2px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
    40%, 60% { transform: translate3d(4px, 0, 0); }
  }

/* SOFT RED PULSE */
  .error-pulse {
    animation: pulse 0.6s ease-in-out;
  }

  @keyframes pulse {
    0% { background: var(--page-bg); }
    50% { background: #7a2828; color: #fff; } /* Soft red flash */
    100% { background: var(--page-bg); }
  }



</style>