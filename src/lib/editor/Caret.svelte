<script lang="ts">
  import { activeModesStore } from "$lib/system/modeEngine";

  /*
  =========================
  CARET POSITION
  =========================
  */
  export let x = 0;
  export let y = 0;
</script>

<div
  class="caret-root"
  style={`
    left:${x}px;
    top:${y}px;
  `}
>
  {#if $activeModesStore.size > 0}
    <div class="ghost-hud">
      {#each Array.from($activeModesStore) as mode}
        <div class="ghost-tag">
          [ {mode} ]
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
/*
=========================
ROOT
=========================
*/
.caret-root {
  position: fixed;
  pointer-events: none;
  z-index: 999999;
  /* Smooth micro-spring physics to follow cursor */
  transition: top 50ms linear, left 50ms linear;
}

/*
=========================
HUD
=========================
*/
.ghost-hud {
  position: absolute;
  left: 18px;
  top: -8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/*
=========================
TAG
=========================
*/
.ghost-tag {
  width: fit-content;
  padding: 2px 6px;
  background: rgba(47, 43, 36, 0.92);
  color: #d7d3b0;
  border-left: 3px solid #d7d3b0;
  font-family: "Vintage ROM", monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
  white-space: nowrap;
  backdrop-filter: blur(6px);
}
</style>