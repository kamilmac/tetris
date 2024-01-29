import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { appState } from "../state";
import { CFG } from "../config";

@customElement("tetris-key")
export class KeyComp extends LitElement {
  @property()
  label?: string;

  @state()
  isPressed: boolean = false;

  static styles = css`
    div {
      color: black;
      background-color: blue;
      border: 1px solid black;
      height: 32px;
      width: 32px;
      overflow: hidden;
      position: relative;
      display: block;
    }
  `;

  constructor() {
    super();
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        console.log("SPACE");
        this.isPressed = true;
        setTimeout(() => {
          this.isPressed = false;
        }, 100);
      }
    });
  }

  render() {
    const style = this.isPressed ? "background: blue" : "background: white";
    return html`<div style="${style}">${this.label}</div>`;
  }
}

const RANDOM_ACTIONS = [
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

@customElement("tetris-controls")
export class UI extends LitElement {
  // score = 0;
  bestScore = localStorage.getItem("bestScore") || 0;

  static styles = css`
    :host {
      position: absolute;
      color: white;
    }
    div {
    }
  `;

  constructor() {
    super();
    // appState.subscribe(["score"], (state) => {
    //   if (state.score > this.bestScore) {
    //     localStorage.setItem("bestScore", `${state.score}`);
    //     this.bestScore = state.score;
    //   }
    //   this.score = state.score;
    //   this.requestUpdate();
    // });
  }

  render() {
    return html` <tetris-key label="Space" /> `;
  }
}
