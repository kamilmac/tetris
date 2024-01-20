import { LitElement, html, css } from "lit";
import { appState } from "../state";

export class ScoreDisplay extends LitElement {
  score = 0;
  bestScore = localStorage.getItem("bestScore") || 0;

  static get styles() {
    return css`
      :host {
        position: absolute;
        top: 0;
        left: 0;
        padding: 10px;
        background-color: white;
      }
      div {
        font-family: monospace;
        color: #5d5148;
      }
    `;
  }

  constructor() {
    super();
    appState.subscribe((score) => {
      if (score > this.bestScore) {
        localStorage.setItem("bestScore", score);
        this.bestScore = score;
      }
      this.score = score;
      this.requestUpdate();
    }, "score");
  }

  render() {
    return html`
      <div>Score: <strong>${this.score}</strong></div>
      <br />
      <div>Best score: <strong>${this.bestScore}</strong></div>
      <br />
      <br />
      <br />
      <div><strong>CONTROLS:</strong></div>
      <br />
      <div>Move block: &uarr; &darr; &rarr; &larr; (or WSAD)</div>
      <br />
      <div>Rotate block: <strong>r</strong></div>
      <br />
      <div>
        Rotate camera: <strong>SHIFT + </strong>&uarr; &darr; &rarr; &larr;
      </div>
      <br />
      <div>Accelerate block: <strong>Space</strong></div>
      <br />
      <div>Restart game: <strong>Enter</strong></div>
      <br />
    `;
  }
}
