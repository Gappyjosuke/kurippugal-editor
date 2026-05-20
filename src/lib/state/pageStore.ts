import { writable }
from "svelte/store";

export type PageData = {

  id: number;

  content: string;
};

const initialPages:
PageData[] = [

  {
    id: 1,
    content: ""
  }
];

export const pages =
  writable(initialPages);