import {
  writable
}
from "svelte/store";

export type AppMode =

  | "WRITING"
  | "MENU";

export const appMode =

  writable<AppMode>(
    "WRITING"
  );