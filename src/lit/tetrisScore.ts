import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("tetris-score")
export class TetrisScore extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      color: white;
    }
    div {
    }
  `;

  render() {
    return html``;
  }
}
