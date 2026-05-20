import { writable } from "svelte/store";
import type { MenuNode } from "./menuTree";

/*
=========================
MENU STATE
=========================
*/
export interface MenuState {
  /*
  OPEN / CLOSE
  */
  isOpen: boolean;

  /*
  CURRENT MENU STACK (Depth)
  */
  path: MenuNode[];

  /*
  CURRENT CURSOR INDEX (Vertical List Position)
  */
  submenuIndex: number;

  /*
  UI TOGGLES
  */
  toggles: Record<string, boolean>;
}

/*
=========================
STORE INITIALIZATION
=========================
*/
export const menuStore = writable<MenuState>({
  isOpen: false,
  path: [],
  submenuIndex: 0,
  toggles: {}
});

/*
=========================
OPEN MENU
=========================
*/
export function openMenu() {
  menuStore.update((state) => ({
    ...state,
    isOpen: true,
    path: [],           // Reset to root menu
    submenuIndex: 0     // Default highlight to the top item
  }));
}

/*
=========================
CLOSE MENU
=========================
*/
export function closeMenu() {
  menuStore.update((state) => ({
    ...state,
    isOpen: false,
    path: [],
    submenuIndex: 0
  }));
}

/*
=========================
SET SUBMENU INDEX
=========================
*/
export function setSubmenuIndex(index: number) {
  menuStore.update((state) => ({
    ...state,
    submenuIndex: index
  }));
}

/*
=========================
PUSH MENU (Enter Submenu)
=========================
*/
export function pushMenu(node: MenuNode) {
  menuStore.update((state) => ({
    ...state,
    path: [...state.path, node],
    submenuIndex: 0 // Reset cursor to the top of the new list
  }));
}

/*
=========================
POP MENU (Go Back)
=========================
*/
export function popMenu() {
  menuStore.update((state) => {
    const newPath = [...state.path];
    newPath.pop();

    return {
      ...state,
      path: newPath,
      submenuIndex: 0 // Reset cursor to the top of the parent list
    };
  });
}

/*
=========================
TOGGLE UI STATE
=========================
*/
export function toggleUIState(action: string) {
  menuStore.update((state) => ({
    ...state,
    toggles: {
      ...state.toggles,
      [action]: !state.toggles[action]
    }
  }));
}