export type ActionType = "persistent" | "oneshot" | "toggle" | "submenu";
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface MenuNode {
  id: string;
  label: string;
  type: ActionType;
  direction?: Direction;
  mode?: string;
  action?: string;
  children?: MenuNode[];
}

export const MENU_TREE: MenuNode[] = [
  /* ========================= LEFT : STRUCTURE ========================= */
  {
    id: "structure", label: "[ STRUCTURE ]", type: "submenu", direction: "LEFT",
    children: [
      { id: "heading1", label: "[ HEADING 1 ]", type: "persistent", mode: "H1" },
      { id: "heading2", label: "[ HEADING 2 ]", type: "persistent", mode: "H2" },
      { id: "heading3", label: "[ HEADING 3 ]", type: "persistent", mode: "H3" },
      { id: "quote", label: "[ QUOTE BLOCK ]", type: "persistent", mode: "QUOTE" },
      { id: "bullet", label: "[ BULLET LIST ]", type: "persistent", mode: "BULLET" },
      { id: "indent", label: "[ INDENT ]", type: "persistent", mode: "INDENT" }
    ]
  },

  /* ========================= RIGHT : STYLE ========================= */
  {
    id: "style", label: "[ STYLE ]", type: "submenu", direction: "RIGHT",
    children: [
      { id: "bold", label: "[ BOLD ]", type: "persistent", mode: "BOLD" },
      { id: "italic", label: "[ ITALIC ]", type: "persistent", mode: "ITALIC" },
      {
        id: "color", label: "[ COLOR... ]", type: "submenu",
        children: [
          { id: "color_red", label: "[ TEXT: RED ]", type: "persistent", mode: "RED" },
          { id: "color_blue", label: "[ TEXT: BLUE ]", type: "persistent", mode: "BLUE" },
          { id: "color_orange", label: "[ TEXT: ORANGE ]", type: "persistent", mode: "ORANGE" }
        ]
      },
      { id: "highlight", label: "[ HIGHLIGHT ]", type: "persistent", mode: "HIGHLIGHT" },
      { id: "insert_link", label: "[ INSERT LINK ]", type: "oneshot", action: "LINK" }
    ]
  },

  /* ========================= UP : SYSTEM ========================= */
  {
    id: "system", label: "[ SYSTEM ]", type: "submenu", direction: "UP",
    children: [
      {
        id: "file", label: "[ FILE... ]", type: "submenu",
        children: [
          { id: "save_file", label: "[ SAVE ]", type: "oneshot", action: "SAVE_FILE" },
          { id: "save_as", label: "[ SAVE AS... ]", type: "oneshot", action: "SAVE_AS" },
          { id: "new_file", label: "[ NEW RECORD ]", type: "oneshot", action: "NEW_FILE" },
          { id: "open_file", label: "[ LOAD RECORD ]", type: "oneshot", action: "OPEN_FILE" }
        ]
      },
      {
        id: "settings", label: "[ SETTINGS... ]", type: "submenu",
        children: [
          { id: "theme_def", label: "[ THEME: DEFAULT ]", type: "oneshot", action: "THEME_DEFAULT" },
          { id: "theme_dark", label: "[ THEME: DARK ]", type: "oneshot", action: "THEME_DARK" },
          { id: "font_fira", label: "[ FONT: FIRA MONO ]", type: "oneshot", action: "FONT_FIRA" },
          { id: "font_plex", label: "[ FONT: IBM PLEX ]", type: "oneshot", action: "FONT_PLEX" }
        ]
      },
      { id: "exit_app", label: "[ EXIT SYSTEM ]", type: "oneshot", action: "EXIT_APP" }
    ]
  },

  /* ========================= DOWN : ENVIRONMENT ========================= */
  {
    id: "environment", label: "[ ENVIRONMENT ]", type: "submenu", direction: "DOWN",
    children: [
      { id: "toggle_bar", label: "[ TOGGLE WINDOW BAR ]", type: "oneshot", action: "TOGGLE_WINDOW_BAR" },
      { id: "pin_1", label: "[ PIN IMAGE 1 ]", type: "oneshot", action: "PIN_IMAGE_1" },
      { id: "pin_2", label: "[ PIN IMAGE 2 ]", type: "oneshot", action: "PIN_IMAGE_2" },
      { id: "clear_pins", label: "[ CLEAR PINS ]", type: "oneshot", action: "CLEAR_PINS" }, // NEW
      { id: "clear_scratchpad", label: "[ CLEAR SCRATCHPAD ]", type: "oneshot", action: "CLEAR_SCRATCHPAD" }
    ]
  }
];