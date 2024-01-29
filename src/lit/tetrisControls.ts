import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("tetris-controls")
export class TetrisControls extends LitElement {
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
    return html`
      <tetris-key label="Left" code="ArrowLeft"></tetris-key>
      <tetris-key label="Right" code="ArrowRight"></tetris-key>
      <tetris-key label="Up" code="ArrowUp"></tetris-key>
      <tetris-key label="Down" code="ArrowDown"></tetris-key>
      <tetris-key label="r" code="KeyR"></tetris-key>
      <tetris-key label="Space" code="Space"></tetris-key>
    `;
  }
}
