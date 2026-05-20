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
      { id: "heading1", label: "[ Heading 1 ]", type: "persistent", mode: "H1" },
      { id: "heading2", label: "[ Heading 2 ]", type: "persistent", mode: "H2" },
      { id: "heading3", label: "[ Heading 3 ]", type: "persistent", mode: "H3" },
      { id: "quote", label: "[ Quote Block ]", type: "persistent", mode: "QUOTE" },
      { id: "bullet", label: "[ Bullet List ]", type: "persistent", mode: "BULLET" },
      { id: "indent", label: "[ Indent ]", type: "persistent", mode: "INDENT" }
    ]
  },

  /* ========================= RIGHT : STYLE ========================= */
  {
    id: "style", label: "[ STYLE ]", type: "submenu", direction: "RIGHT",
    children: [
      { id: "bold", label: "[ Bold ]", type: "persistent", mode: "BOLD" },
      { id: "italic", label: "[ Italic ]", type: "persistent", mode: "ITALIC" },
      {
        id: "color", label: "[ Color... ]", type: "submenu",
        children: [
          { id: "color_red", label: "[ Text: Red ]", type: "persistent", mode: "RED" },
          { id: "color_blue", label: "[ Text: Blue ]", type: "persistent", mode: "BLUE" },
          { id: "color_orange", label: "[ Text: Orange ]", type: "persistent", mode: "ORANGE" }
        ]
      },
      { id: "highlight", label: "[ Highlight ]", type: "persistent", mode: "HIGHLIGHT" },
      { id: "insert_link", label: "[ Insert Link ]", type: "oneshot", action: "LINK" }
    ]
  },

  /* ========================= UP : SYSTEM ========================= */
  {
    id: "system", label: "[ SYSTEM ]", type: "submenu", direction: "UP",
    children: [
      {
        id: "file", label: "[ File... ]", type: "submenu",
        children: [
          { id: "new_file", label: "[ New Record ]", type: "oneshot", action: "NEW_FILE" },
          { id: "open_file", label: "[ Load Record ]", type: "oneshot", action: "OPEN_FILE" },
          { id: "save_file", label: "[ Overwrite Save ]", type: "oneshot", action: "SAVE_FILE" },
          { id: "save_as", label: "[ Save As... ]", type: "oneshot", action: "SAVE_AS" }
        ]
      },
      {
        id: "settings", label: "[ Settings... ]", type: "submenu",
        children: [
          { id: "theme_def", label: "[ Theme: Default ]", type: "oneshot", action: "THEME_DEFAULT" },
          { id: "theme_dark", label: "[ Theme: Dark ]", type: "oneshot", action: "THEME_DARK" },
          { id: "font_fira", label: "[ Font: Fira Mono ]", type: "oneshot", action: "FONT_FIRA" },
          { id: "font_plex", label: "[ Font: IBM Plex ]", type: "oneshot", action: "FONT_PLEX" }
        ]
      },
      { id: "exit_app", label: "[ EXIT SYSTEM ]", type: "oneshot", action: "EXIT_APP" }
    ]
  },

  /* ========================= DOWN : ENVIRONMENT ========================= */
  {
    id: "environment", label: "[ ENVIRONMENT ]", type: "submenu", direction: "DOWN",
    children: [
      { id: "toggle_bar", label: "[ Toggle Window Bar ]", type: "oneshot", action: "TOGGLE_WINDOW_BAR" },
      { id: "pin_1", label: "[ Pin Image 1 ]", type: "oneshot", action: "PIN_IMAGE_1" },
      { id: "pin_2", label: "[ Pin Image 2 ]", type: "oneshot", action: "PIN_IMAGE_2" },
      { id: "clear_pins", label: "[ Clear Pins ]", type: "oneshot", action: "CLEAR_PINS" }, // NEW
      { id: "clear_scratchpad", label: "[ Purge Scratchpad ]", type: "oneshot", action: "CLEAR_SCRATCHPAD" }
    ]
  }
];