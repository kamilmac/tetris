import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { appState } from "../state";

interface Variant {
	label: string;
	button: string;
}

@customElement("tetris-cta")
export class TetrisCTA extends LitElement {
	variants: Record<string, Variant | null> = {
		play: {
			label: "Press to start playing!",
			button: "PLAY",
		},
		restart: {
			label: "Press to play again!",
			button: "GO AGAIN",
		},
		empty: null,
	};

	activeVariant = "play";

	static styles = css`
    :host {
      position: absolute;
      width: 200px;
      bottom: 30px;
      left: calc(50% - 100px);
      color: white;
    }
    div {
    }
  `;

	constructor() {
		super();
		appState.subscribe(["status"], (state) => {
			if (state.status === "inDemo") {
				this.activeVariant = "play";
			} else if (state.status === "gameOver") {
				this.activeVariant = "restart";
			} else {
				this.activeVariant = "empty";
			}
			this.requestUpdate();
		});
	}

	handleClick() {
		appState.changeStatus("playing");
	}

	render() {
		const v = this.variants[this.activeVariant];
		if (!v) {
			return null;
		}
		return html`
      <h3>${v.label}</h3>
      <div data-test="cta-play" @click=${this.handleClick}>
        ${v.button}
      </div>
    `;
	}
}
