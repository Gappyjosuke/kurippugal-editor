<script lang="ts">
  import { onMount } from "svelte";
  import RadialMenu from "$lib/system/RadialMenu.svelte";
  import { menuStore } from "$lib/system/menuStore";
  import SidebarStats from "./SidebarStats.svelte";
  import Scratchpad from "./Scratchpad.svelte";
  import AmbientWidget from "./AmbientWidget.svelte";
  import ReferencePins from "./ReferencePins.svelte";
  import SaveIndicator from "$lib/system/SaveIndicator.svelte";
  import LexicalEditor from "$lib/editor/LexicalEditor.svelte";
  import { themeStore } from "$lib/system/appStore";
  import SystemPrompt from "$lib/system/SystemPrompt.svelte";
  import WireframeObject from "./WireframeObject.svelte";

  let isMounted = false;

  onMount(() => {
    setTimeout(() => {
      isMounted = true;
    }, 50); 
  });
</script>

<div
  class="workspace"
  class:menu-open={$menuStore.isOpen}
  data-theme={$themeStore}
  style="opacity: {isMounted ? 1 : 0}; transition: opacity 0.3s ease-in;"
>

  <div class="app-title">
    kurippugal
  </div>

  <div class="film-grain"></div>

  <div class="left-sidebar">
    <SidebarStats />
    <ReferencePins />
    <AmbientWidget />
    </div>

  <div class="center-area">
    <div class="page">
      <div class="noise"></div>
      <LexicalEditor />
    </div>
  </div>

<div class="right-sidebar">
    <WireframeObject />
    
    <Scratchpad />
    
    <div class="social-links">
      <a href="https://github.com/Gappyjosuke" target="_blank" title="GitHub">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      </a>
      <a href="https://www.linkedin.com/in/sastharuban" target="_blank" title="LinkedIn">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      </a>
    </div>
  </div>

  <RadialMenu />
  <SystemPrompt />
  <SaveIndicator />

</div>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
    font-family: "Tw Cen MT", sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  /*
  =========================
  THEME VARIABLES & WORKSPACE
  =========================
  */
  .workspace {
    /* DEFAULT (LIGHT) THEME */
    --bg-spot-top: rgba(255,245,220,0.20);
    --bg-spot-bot: rgba(240,230,210,0.10);
    --bg-base-start: #d7d3b0;
    --bg-base-end: #c7c2a2;
    --page-bg: rgba(233,225,189,0.72);
    --page-border: rgba(80,70,55,0.12);
    --title-col: rgba(73, 71, 59, 0.82);

    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-columns: 260px 1fr 260px;
    position: relative;
    overflow: hidden;

    background:
      radial-gradient(circle at top, var(--bg-spot-top), transparent 45%),
      radial-gradient(circle at bottom right, var(--bg-spot-bot), transparent 35%),
      linear-gradient(to bottom, var(--bg-base-start), var(--bg-base-end));
    
    transition: background 0.5s ease;
  }

  /* DARK THEME OVERRIDES */
  .workspace[data-theme="DARK"] {
    --bg-spot-top: rgba(255,255,255,0.03);
    --bg-spot-bot: rgba(255,255,255,0.02);
    --bg-base-start: #161616;
    --bg-base-end: #0a0a0a;
    --page-bg: rgba(25, 25, 25, 0.85);
    --page-border: rgba(255, 255, 255, 0.08);
    --title-col: rgba(180, 180, 180, 0.4);
  }

  /*
  =========================
  MENU OPEN STATE
  =========================
  */
  .menu-open :global(.editor),
  .menu-open :global(textarea) {
    pointer-events: none;
    user-select: none;
  }

  .menu-open .page,
  .menu-open .left-sidebar,
  .menu-open .right-sidebar {
    filter: blur(3px) brightness(0.96);
    transition: filter 0.12s linear;
    will-change: filter;
  }

  /*
  =========================
  SIDEBARS & CENTER
  =========================
  */
  .left-sidebar {
    height: 100%;
    padding: 42px;
    padding-top: 68px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 42px;
    z-index: 2;
  }

.right-sidebar {
    width: 260px;
    height: 100%;
    padding: 42px; /* Matches the left sidebar padding */
    padding-top: 68px;
    display: flex;
    flex-direction: column; /* FIX: Stacks items vertically! */
    justify-content: flex-start;
    align-items: center;
    gap: 32px; /* Adds perfect spacing between the wireframe and scratchpad */
    z-index: 2;
  }

  /* Centered perfectly at the bottom of the right sidebar */
  .social-links {
    margin-top: auto; /* Pushes the icons to the very bottom */
    display: flex;
    justify-content: center;
    gap: 24px;
    width: 100%;
    padding-bottom: 10px;
  }

  .social-links a {
    color: var(--text-muted);
    transition: color 0.3s ease, transform 0.3s ease;
  }

  .social-links a:hover {
    color: var(--text-main);
    transform: translateY(-3px) scale(1.1);
  }

  .center-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 24px;
    overflow: hidden;
    z-index: 1;
  }

  /*
  =========================
  PAGE
  =========================
  */
.page {
    width: clamp(620px, 58vw, 860px);
    height: clamp(680px, 88vh, 980px);
    position: relative;
    
    /* FIX: Stop the main page from scrolling */
    overflow: hidden; 
    display: flex;
    flex-direction: column;
    
    /* FIX: Reduced top padding so the status bar sits nicely at the top */
    padding: 24px clamp(38px, 4vw, 72px) 0 clamp(38px, 4vw, 72px);
    border-radius: 26px;
    
    background: var(--page-bg);
    border: 1px solid var(--page-border);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.22),
      0 20px 60px rgba(0,0,0,0.10);
    backdrop-filter: blur(10px);
    
    transition: background 0.5s ease, border 0.5s ease, box-shadow 0.3s ease, filter 0.12s linear;
  }

  .page:hover {
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.24),
      0 28px 80px rgba(0,0,0,0.12);
  }

  .page::-webkit-scrollbar {
    display: none;
  }

  /*
  =========================
  PAGE NOISE & FILM GRAIN
  =========================
  */
  .noise {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    background-image: radial-gradient(rgba(0,0,0,0.35) 0.4px, transparent 0.5px);
    background-size: 5px 5px;
  }

  .film-grain {
    position: absolute;
    inset: -50%;
    pointer-events: none;
    opacity: 0.08;
    z-index: 1;
    mix-blend-mode: multiply;
    background-image: radial-gradient(#000 0.4px, transparent 0.5px);
    background-size: 6px 6px;
    animation: grainMove 0.18s steps(2) infinite;
  }

  @keyframes grainMove {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-1%, 1%); }
    50% { transform: translate(1%, -1%); }
    75% { transform: translate(0.5%, 1%); }
    100% { transform: translate(0, 0); }
  }

  /*
  =========================
  APP TITLE
  =========================
  */
  .app-title {
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    font-family: "Amsterdam", cursive;
    font-size: 42px;
    
    /* Tied to Theme Variables */
    color: var(--title-col);
    
    letter-spacing: 0.3em;
    pointer-events: none;
    user-select: none;
    z-index: 20;
    
    /* Smooth transition */
    transition: color 0.5s ease;
  }

  /*
  =========================
  RESPONSIVE
  =========================
  */
  @media (max-width: 1450px) {
    .workspace {
      grid-template-columns: 220px 1fr 220px;
    }
    .page {
      width: clamp(560px, 64vw, 780px);
    }
  }

  @media (max-width: 1200px) {
    .left-sidebar,
    .right-sidebar {
      display: none;
    }
    .workspace {
      grid-template-columns: 1fr;
    }
    .page {
      width: min(94vw, 860px);
      height: 94vh;
    }
  }


</style>