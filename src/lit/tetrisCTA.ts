import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

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

	render() {
		return html`
      <h3>Hello, World!</h3>
      <button>CTA placeholder</button>
    `;
	}
}
