import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("tetris-score")
export class TetrisScore extends LitElement {
	static styles = css`
    :host {
      position: absolute;
      top: 0;
      right: 0;
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
