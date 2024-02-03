import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("tetris-logo")
export class TetrisLogo extends LitElement {
	static styles = css`
    :host {
      position: absolute;
      color: white;
      top: 0;
      left: 0;
      color: white;
      width: 200px;
      height: 150px;
      background: pink;
    }
    div {
    }
  `;

	render() {
		return html``;
	}
}
