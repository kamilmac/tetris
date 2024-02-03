import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("tetris-legend")
export class TetrisLegend extends LitElement {
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

  render() {
    return html`
      <tetris-key label="Left" code="ArrowLeft"></tetris-key>
      <tetris-key label="Right" code="ArrowRight"></tetris-key>
      <tetris-key label="Up" code="ArrowUp"></tetris-key>
      <tetris-key label="Down" code="ArrowDown"></tetris-key>
      <tetris-key label="r" code="KeyR"></tetris-key>
      <tetris-key label="Space" code="Space"></tetris-key>
      <tetris-key label="Shift" shift></tetris-key>
    `;
  }
}
