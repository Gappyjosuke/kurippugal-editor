import { MENU_TREE, type MenuNode } from "./menuTree";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { scratchpadStore, themeStore, fontStore, systemPromptStore, pin1Store, pin2Store, activeFileHandle, isSavingStore } from "./appStore";
import { openMenu, closeMenu, setSubmenuIndex, pushMenu, popMenu, toggleUIState, menuStore } from "./menuStore";
import { get, writable } from "svelte/store";
import { activateMode, clearAllModes, getModeTags } from "./modeEngine";
import { editorContent } from "../editor/store"; 

import { save, open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';

export const menuErrorTrigger = writable(false);

const rootNodes: any[] = [
  MENU_TREE.find((n) => n.direction === "UP"),    
  MENU_TREE.find((n) => n.direction === "LEFT"),  
  MENU_TREE.find((n) => n.direction === "RIGHT"), 
  MENU_TREE.find((n) => n.direction === "DOWN"),  
  { label: "[ RESET ]", isReset: true, children: null, type: "oneshot" }
].filter(Boolean);

export async function handleKeyDown(event: KeyboardEvent) {
  if (event.altKey && event.key.toLowerCase() === "x") {
    event.preventDefault();
    event.stopPropagation();
    const state = get(menuStore);
    if (state.isOpen) closeMenu();
    else {
      openMenu();
      const activeElement = document.activeElement as HTMLElement | null;
      activeElement?.blur(); 
    }
    return;
  }

  const state = get(menuStore);
  if (!state.isOpen) return;

  event.preventDefault();
  event.stopPropagation();

  if (event.key === "Escape") {
    closeMenu();
    return;
  }

  const currentLevelList = state.path.length === 0 ? rootNodes : state.path[state.path.length - 1].children;
  if (!currentLevelList) return;

  const maxIndex = currentLevelList.length - 1;
  const currentItem = currentLevelList[state.submenuIndex];

  if (event.key === "ArrowUp") {
    setSubmenuIndex(state.submenuIndex > 0 ? state.submenuIndex - 1 : maxIndex);
    return;
  }

  if (event.key === "ArrowDown") {
    setSubmenuIndex(state.submenuIndex < maxIndex ? state.submenuIndex + 1 : 0);
    return;
  }

  if (event.key === "ArrowRight") {
    if (currentItem && currentItem.children) pushMenu(currentItem);
    return;
  }

  if (event.key === "ArrowLeft" || event.key === "Backspace") {
    if (state.path.length > 0) popMenu();
    return;
  }

  if (event.code === "Space" || event.key === "Enter") {
    const activeDOMElement = document.querySelector('.menu-item.active');
    if (activeDOMElement) {
      activeDOMElement.classList.add('pressed-anim');
      setTimeout(() => activeDOMElement.classList.remove('pressed-anim'), 80);
    }

    if (!currentItem) return;

    if (currentItem.isReset) {
      clearAllModes();
      closeMenu();
      return;
    }

    if (currentItem.children) {
      pushMenu(currentItem);
      return;
    }

    if (currentItem.type === "persistent" && currentItem.mode) {
      const activeModes = getModeTags();
      const isColorMode = ["RED", "BLUE", "ORANGE"].includes(currentItem.mode);
      const hasOtherColor = activeModes.some((m: string) => ["RED", "BLUE", "ORANGE"].includes(m) && m !== currentItem.mode);
      
      if (isColorMode && hasOtherColor) {
        menuErrorTrigger.set(true);
        setTimeout(() => menuErrorTrigger.set(false), 300);
      }
      activateMode(currentItem.mode);
      return;
    }

    if (currentItem.type === "toggle" && currentItem.action) {
      toggleUIState(currentItem.action);
      return;
    }

    if (currentItem.type === "oneshot") {
      const action = currentItem.action;

      if (action === "EXIT_APP") {
        closeMenu();
        systemPromptStore.set({
          isOpen: true,
          type: "confirm",
          message: "The selected action will terminate Kurippugal.\nUnsaved data may be lost.\n\nDo you wish to exit the system?",
          onConfirm: async () => {
            try {
              const { getCurrentWindow } = await import('@tauri-apps/api/window');
              await getCurrentWindow().close();
            } catch (err) {
              window.close();
            }
          }
        });
        return;
      }

      if (action === "LINK") {
        closeMenu();
        systemPromptStore.set({
          isOpen: true,
          type: "input",
          message: "Enter the target URL data link below:",
          onConfirm: (url) => {
            if (url) {
              const editor = document.querySelector('.editor') as HTMLElement;
              editor?.focus();
              document.execCommand("createLink", false, url);
            }
          }
        });
        return;
      }

      /* ==========================================================
         NEW FILE SYSTEM
      ========================================================== */
      if (action === "NEW_FILE") {
        closeMenu(); 
        
        systemPromptStore.set({
          isOpen: true,
          type: "confirm",
          message: "Initialize a new blank record?\nAny unsaved data currently in the workspace will be permanently erased.",
          onConfirm: () => {
            const editor = document.querySelector('.editor');
            if (editor) editor.innerHTML = "";
            
            editorContent.set("");
            localStorage.setItem("kurippugal-document", "");
            activeFileHandle.set(null); 
            
            // CUSTOM MESSAGE 1: NEW FILE
            isSavingStore.set("SYSTEM // WIPING MEMORY...");
            setTimeout(() => isSavingStore.set(""), 1500);
          }
        });
        return;
      }

      /* ==========================================================
         SAVE / LOAD SYSTEM (TAURI NATIVE OS API)
      ========================================================== */
      
      if (action === "SAVE_AS") {
        closeMenu(); 
        try {
          const filePath = await save({
            filters: [{ name: 'Kurippugal Document', extensions: ['html'] }],
            defaultPath: 'kurippugal_record.html'
          });
          
          if (filePath) {
            const content = document.querySelector('.editor')?.innerHTML || "";
            await writeTextFile(filePath, content);
            activeFileHandle.set(filePath);
            
            // CUSTOM MESSAGE 2: SAVE AS
            isSavingStore.set("SYSTEM // RECORDING NEW DATA...");
            setTimeout(() => isSavingStore.set(""), 1500);
          }
        } catch (err) {
          console.error("Save As failed:", err);
        }
        return;
      }

      if (action === "SAVE_FILE") {
        closeMenu(); 
        try {
          let currentPath = get(activeFileHandle);
          
          if (!currentPath || typeof currentPath !== 'string') {
            currentPath = await save({
              filters: [{ name: 'Kurippugal Document', extensions: ['html'] }],
              defaultPath: 'kurippugal_record.html'
            });
            if (currentPath) activeFileHandle.set(currentPath);
          }
          
          if (currentPath) {
            const content = document.querySelector('.editor')?.innerHTML || "";
            await writeTextFile(currentPath, content);
            
            // CUSTOM MESSAGE 3: OVERWRITE SAVE
            isSavingStore.set("SYSTEM // OVERWRITING RECORD...");
            setTimeout(() => isSavingStore.set(""), 1500);
          }
        } catch (err) {
          console.error("Overwrite failed:", err);
        }
        return;
      }

      if (action === "OPEN_FILE") {
        closeMenu(); 
        try {
          const selectedPath = await open({
            multiple: false,
            filters: [{ name: 'Document', extensions: ['html', 'txt'] }]
          });
          
          if (selectedPath && !Array.isArray(selectedPath)) {
            const html = await readTextFile(selectedPath);
            const editor = document.querySelector('.editor');
            if (editor) {
              editor.innerHTML = html;
              localStorage.setItem("kurippugal-document", html);
              activeFileHandle.set(selectedPath);
              
              // CUSTOM MESSAGE 4: LOAD RECORD
              isSavingStore.set("SYSTEM // EXTRACTING DATA...");
              setTimeout(() => isSavingStore.set(""), 1500);
            }
          }
        } catch (err) {
          console.error("Open file failed:", err);
        }
        return;
      }

/* ==========================================================
         ENVIRONMENT SETTINGS
      ========================================================== */
      if (action === "TOGGLE_WINDOW_BAR") {
        closeMenu(); 
        
        // Let the user know the command was received
        isSavingStore.set("SYSTEM // RECONFIGURING SHELL...");
        setTimeout(() => isSavingStore.set(""), 1500);

        // A bulletproof Async IIFE to handle Tauri v1 AND v2
        (async () => {
          try {
            const windowApi = await import('@tauri-apps/api/window');
            // This safely grabs the window whether you are on v1 or v2
            const win = windowApi.getCurrentWindow ? windowApi.getCurrentWindow() : (windowApi as any).appWindow;
            
            const isDecorated = await win.isDecorated();
            await win.setDecorations(!isDecorated);
          } catch (err) {
            console.error("Window toggle failed:", err);
            // If it fails, force open a prompt so we can actually see the error!
            systemPromptStore.set({
              isOpen: true,
              type: "confirm",
              message: "SYSTEM ERROR: Window toggle blocked by OS or Tauri permissions.\nPlease check your console.",
              onConfirm: () => {}
            });
          }
        })();
        
        return;
      }

      if (action === "CLEAR_SCRATCHPAD") scratchpadStore.set("");
      
      if (action === "CLEAR_PINS") {
        pin1Store.set("");
        pin2Store.set("");
      }

      if (action === "PIN_IMAGE_1") document.getElementById("hidden-img-upload-1")?.click();
      if (action === "PIN_IMAGE_2") document.getElementById("hidden-img-upload-2")?.click();

      // THEMES & FONTS
      if (action === "THEME_DEFAULT") themeStore.set("DEFAULT");
      if (action === "THEME_DARK") themeStore.set("DARK");
      if (action === "FONT_FIRA") {
        document.documentElement.style.setProperty('--editor-font', '"Fira Mono", monospace');
        fontStore.set("FIRA");
      }
      if (action === "FONT_PLEX") {
        document.documentElement.style.setProperty('--editor-font', '"IBM Plex Serif", serif');
        fontStore.set("PLEX");
      }

      closeMenu(); 
      return;
    }
  }
}

export function initializeInputController() {
  window.addEventListener("keydown", handleKeyDown);
}