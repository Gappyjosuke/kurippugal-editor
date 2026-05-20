import {
  writable,
  get
} from "svelte/store";

/*
=========================
ACTIVE MODES STORE
=========================
*/
export const activeModesStore = writable<Set<string>>(new Set());

/*
=========================
MODE TYPES
=========================
*/
const STRUCTURE_MODES = [
  "H1",
  "H2",
  "H3",
  "QUOTE",
  "BULLET",
  "INDENT"
];

const INLINE_MODES = [
  "BOLD",
  "ITALIC",
  "RED",
  "BLUE",
  "ORANGE", // Replaced SAND
  "HIGHLIGHT",
  "LINK"
];

/*
=========================
GET MODE TAGS
=========================
*/
export function getModeTags(): string[] {
  return Array.from(get(activeModesStore));
}

/*
=========================
CHECK MODE TYPE
=========================
*/
function isStructureMode(mode: string) {
  return STRUCTURE_MODES.includes(mode);
}

function isInlineMode(mode: string) {
  return INLINE_MODES.includes(mode);
}

/*
=========================
ACTIVATE MODE
=========================
*/
export function activateMode(mode: string) {
  activeModesStore.update((oldModes) => {
    /*
    IMPORTANT:
    NEVER mutate original Set
    */
    const modes = new Set(oldModes);

    /*
    =====================
    TOGGLE OFF
    =====================
    */
    if (modes.has(mode)) {
      modes.delete(mode);
      applyFormattingToEditor(mode, false);
      return modes;
    }

    /*
    =====================
    STRUCTURE MODES
    ONLY ONE ACTIVE
    =====================
    */
    if (isStructureMode(mode)) {
      STRUCTURE_MODES.forEach((structureMode) => {
        modes.delete(structureMode);
      });
    }

    /*
    =====================
    VALIDATION LOGIC
    Prevent multiple text colors at once
    =====================
    */
    if (isInlineMode(mode) && mode !== "HIGHLIGHT" && mode !== "LINK") {
      ["RED", "BLUE", "ORANGE"].forEach(c => modes.delete(c));
    }

    /*
    =====================
    ADD MODE
    =====================
    */
    modes.add(mode);

    /*
    =====================
    APPLY FORMAT
    =====================
    */
    applyFormattingToEditor(mode, true);
    return modes;
  });
}

/*
=========================
CLEAR ALL MODES (THE BUG FIX)
=========================
*/
export function clearAllModes() {
  const currentModes = get(activeModesStore);

  // CRITICAL FIX: Ensure the browser selection is collapsed (just a blinking cursor)
  // before we execute commands. If text is highlighted, we collapse it to the END
  // so we don't accidentally wipe formatting from already-written words.
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed) {
    selection.collapseToEnd();
  }

  // 1. Manually untoggle active inline styles
  if (currentModes.has("BOLD")) document.execCommand("bold");
  if (currentModes.has("ITALIC")) document.execCommand("italic");

  // 2. Force default text color (inherit allows CSS Dark Mode to work!)
  document.execCommand("styleWithCSS", false, "true");
  document.execCommand("foreColor", false, "inherit"); 
  document.execCommand("backColor", false, "transparent"); // clear highlights

  // 3. Reset block structure to standard paragraph
  document.execCommand("formatBlock", false, "<p>");

  // 4. Clear the UI store
  activeModesStore.set(new Set());
}

/*
=========================
APPLY FORMATTING
=========================
*/
function applyFormattingToEditor(
  mode: string,
  enabled: boolean
) {
  /*
  TEMPORARY:
  execCommand prototype

  Later:
  Selection API
  AST system
  */

  /*
  =====================
  INLINE STYLES
  =====================
  */
  if (mode === "BOLD") {
    document.execCommand("bold");
    return;
  }

  if (mode === "ITALIC") {
    document.execCommand("italic");
    return;
  }

  /*
  =====================
  COLORS
  =====================
  */
  const colorMap: Record<string, string> = {
    RED: "#c44b4b",
    BLUE: "#4b8ec4",
    ORANGE: "#c47a4b" // Replaced Sand
  };

  if (colorMap[mode]) {
    // "inherit" allows it to return to either White (Dark Mode) or Dark Grey (Light Mode)
    document.execCommand(
      "foreColor",
      false,
      enabled ? colorMap[mode] : "inherit"
    );
    return;
  }

  /*
  =====================
  HIGHLIGHT
  =====================
  */
  if (mode === "HIGHLIGHT") {
    document.execCommand(
      "backColor", 
      false, 
      enabled ? "rgba(200,180,100,0.4)" : "transparent"
    );
    return;
  }

  /*
  =====================
  STRUCTURE
  =====================
  */
  if (mode === "H1") {
    document.execCommand("formatBlock", false, "<h1>");
    return;
  }

  if (mode === "H2") {
    document.execCommand("formatBlock", false, "<h2>");
    return;
  }

  if (mode === "H3") {
    document.execCommand("formatBlock", false, "<h3>");
    return;
  }

  if (mode === "QUOTE") {
    document.execCommand("formatBlock", false, "<blockquote>");
    return;
  }

  /*
  =====================
  BULLET
  =====================
  */
  if (mode === "BULLET") {
    document.execCommand("insertUnorderedList");
    return;
  }
}