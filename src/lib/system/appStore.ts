import { writable } from "svelte/store";

// Helper to load from localStorage
function getSaved(key: string, fallback: string) {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || fallback;
  }
  return fallback;
}

// 1. Scratchpad Data
export const scratchpadStore = writable(getSaved("kp-scratchpad", ""));
scratchpadStore.subscribe(val => {
  if (typeof window !== "undefined") localStorage.setItem("kp-scratchpad", val);
});

// 2. Reference Images (Base64 strings)
export const pin1Store = writable(getSaved("kp-pin1", ""));
pin1Store.subscribe(val => {
  if (typeof window !== "undefined") localStorage.setItem("kp-pin1", val);
});

export const pin2Store = writable(getSaved("kp-pin2", ""));
pin2Store.subscribe(val => {
  if (typeof window !== "undefined") localStorage.setItem("kp-pin2", val);
});

// 3. UI Theme & Font
export const themeStore = writable(getSaved("kp-theme", "DEFAULT"));
export const fontStore = writable(getSaved("kp-font", "Fira Mono"));

// =========================
// 4. SYSTEM PROMPT STORE (NEW)
// =========================
type PromptConfig = {
  isOpen: boolean;
  type: "confirm" | "input";
  message: string;
  onConfirm: (val?: string) => void;
};

export const systemPromptStore = writable<PromptConfig>({
  isOpen: false,
  type: "confirm",
  message: "",
  onConfirm: () => {}
});

// =========================
// 5. ACTIVE FILE STATE
// =========================
// This remembers the physical file on your hard drive so we can overwrite it
export const activeFileHandle = writable<any>(null);

// =========================
// 6. SAVING UI STATE
// =========================
export const isSavingStore = writable<string>("");

