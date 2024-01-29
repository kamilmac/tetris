import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { CFG } from "../config";

const RANDOM_ACTIONS: (keyof typeof CFG.controls)[] = [
  "left",
  "right",
  "up",
  "down",
  "left",
  "right",
  "up",
  "down",
  "fall",
  "fall",
  "rotate",
  "rotate",
  "rotate",
  "rotate",
  "camera_rotate_right",
  "camera_rotate_left",
];

@customElement("tetris-ai")
export class TetrisAI extends LitElement {
  constructor() {
    super();
    setInterval(() => {
      const chance = 0.1;
      if (Math.random() < chance) {
        const randomAction =
          RANDOM_ACTIONS[Math.floor(Math.random() * RANDOM_ACTIONS.length)];
        const event = CFG.controls[randomAction];
        if (!event) {
          return;
        }
        document.dispatchEvent(event);
      }
    }, 40);
  }
}
