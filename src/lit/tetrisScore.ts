import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { appState } from "../state";

@customElement("tetris-score")
export class TetrisScore extends LitElement {
	score = 0;
	bestScore = appState.state.bestScore;

	static styles = css`
    :host {
      position: absolute;
      top: 0;
      right: 0;
      color: white;
      width: 200px;
      height: 150px;
      color: white;
    }
    div {
    }
  `;

	constructor() {
		super();
		appState.subscribe(["score", "bestScore"], (state) => {
			console.log("yo", state);
			this.score = state.score;
			this.bestScore = state.bestScore;
			this.requestUpdate();
		});
	}

	render() {
		return html`
				<div>${this.score}</div>
				<div>${this.bestScore}</div>
			`;
	}
}
