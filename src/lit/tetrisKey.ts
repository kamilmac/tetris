import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("tetris-key")
export class TetrisKey extends LitElement {
  @property()
  code?: string;

  @property()
  label?: string;

  @property({ type: Boolean })
  shift?: boolean = false;

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
      if (e.code === this.code) {
        console.log(e);
        this.isPressed = true;
        setTimeout(() => {
          this.isPressed = false;
        }, 300);
      }
      if (this.shift && e.shiftKey) {
        this.isPressed = true;
        setTimeout(() => {
          this.isPressed = false;
        }, 300);
      }
    });
  }

  render() {
    const style = this.isPressed ? "background: blue" : "background: white";
    return html`<div style="${style}">${this.label}</div>`;
  }
}
