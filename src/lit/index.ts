import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./tetrisControls";
import "./tetrisKey";
import "./tetrisAI";

@customElement("tetris-lit")
export class TetrisLit extends LitElement {
  render() {
    return html`
      <tetris-ai></tetris-ai>
      <tetris-controls></tetris-controls>
    `;
  }
}
