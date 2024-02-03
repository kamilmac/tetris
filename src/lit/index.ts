import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./tetrisAI";
import "./tetrisKey";
import "./tetrisLegend";
import "./tetrisLogo";
import "./tetrisScore";

@customElement("tetris-lit")
export class TetrisLit extends LitElement {
	render() {
		return html`
      <tetris-logo></tetris-logo>
      <tetris-legend></tetris-legend>
      <tetris-score></tetris-score>
      <tetris-cta></tetris-cta>
      <tetris-ai></tetris-ai>
    `;
	}
}
