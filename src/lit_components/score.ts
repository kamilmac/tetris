import { LitElement, html, css } from "lit";
import { appState } from "../state";

export class ScoreDisplay extends LitElement {
  score = 0;

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
      this.score = state.score;
      this.requestUpdate();
    });
  }

  render() {
    return html` <div>Score: ${this.score}</div> `;
  }
}
