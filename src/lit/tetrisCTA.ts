import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { appState } from "../state";

@customElement("tetris-cta")
export class TetrisCTA extends LitElement {
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

	handleClick() {
		appState.changeStatus("playing");
	}

	render() {
		return html`
      <h3>Press to start playing!</h3>
      <div data-test="cta-play" @click=${this.handleClick}>PLAY</div>
    `;
	}
}
