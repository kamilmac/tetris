import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { appState } from "../state";

@customElement("tetris-legend")
export class TetrisLegend extends LitElement {
	folded: boolean;
	bestScore = localStorage.getItem("bestScore") || 0;

	static styles = css`
    .container {
      position: absolute;
      height: 200px;
      top: calc(40% - 100px);
      color: white;
    }
    div {
    }
  `;

	constructor() {
		super();
		this.folded = false;
		appState.subscribe(["status"], (state) => {
			const folded = !["inMenu", "pause"].includes(state.status);
			if (folded !== this.folded) {
				this.folded = folded;
				this.requestUpdate();
			}
		});
	}

	render() {
		const style = this.folded ? "left:0" : "left:300px";
		return html`
      <div class="container" style="${style}">
        <tetris-key label="Left" code="ArrowLeft"></tetris-key>
        <tetris-key label="Right" code="ArrowRight"></tetris-key>
        <tetris-key label="Up" code="ArrowUp"></tetris-key>
        <tetris-key label="Down" code="ArrowDown"></tetris-key>
        <tetris-key label="r" code="KeyR"></tetris-key>
        <tetris-key label="Space" code="Space"></tetris-key>
        <tetris-key label="Shift" shift></tetris-key>
      </div>
    `;
	}
}
