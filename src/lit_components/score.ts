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
    appState.subscribe((state) => {
      if (state.score > this.bestScore) {
        localStorage.setItem("bestScore", state.score);
        this.bestScore = state.score;
      }
      this.score = state.score;
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <div>Score: ${this.score}</div>
      <br />
      <div>Best score: ${this.bestScore}</div>
    `;
  }
}
