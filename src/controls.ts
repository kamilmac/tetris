import { Brick } from "./brick";
import { appState } from "./state";
import { Engine } from "./three/engine";

export class Controls {
	actions: string[];
	private currentKeyUpHandler?: ((event: KeyboardEvent) => void) | null;
	activeCamera = 0;
	brick?: Brick;
	onFastForward: () => void;
	engine: Engine;
	onResetGame: () => void;

	constructor(
		onResetGame: () => void,
		engine: Engine,
		onFastForward: () => void,
	) {
		this.brick = undefined;
		this.onResetGame = onResetGame;
		this.engine = engine;
		this.onFastForward = onFastForward;
		this.addControls();
		this.actions = [];
	}

	reset() {
		this.actions = [];
	}

	cameraCorrection(action: string) {
		switch (this.engine?.camera?.activeCamera) {
			case 0:
				return action;
			case 1:
				switch (action) {
					case "left":
						return "down";
					case "right":
						return "up";
					case "up":
						return "left";
					case "down":
						return "right";
					default:
						return action;
				}
			case 2:
				switch (action) {
					case "left":
						return "right";
					case "right":
						return "left";
					case "up":
						return "down";
					case "down":
						return "up";
					default:
						return action;
				}
			case 3:
				switch (action) {
					case "left":
						return "up";
					case "right":
						return "down";
					case "up":
						return "right";
					case "down":
						return "left";
					default:
						return action;
				}
			default:
				return action;
		}
	}

	addControls() {
		if (this.currentKeyUpHandler) {
			document.removeEventListener("keydown", this.currentKeyUpHandler);
			this.currentKeyUpHandler = null;
		}

		const keyUpHandler = (event: KeyboardEvent) => {
			if (appState.state.status !== "playing" && event.isTrusted) {
				return;
			}
			switch (event.key) {
				case "ArrowLeft":
				case "h":
				case "a":
					if (event.shiftKey) {
						this.actions.push("camera_rotate_left");
					} else {
						this.actions.push(this.cameraCorrection("left"));
					}
					break;
				case "H":
					this.actions.push("camera_rotate_left");
					break;
				case "ArrowRight":
				case "l":
				case "d":
					if (event.shiftKey) {
						this.actions.push("camera_rotate_right");
					} else {
						this.actions.push(this.cameraCorrection("right"));
					}
					break;
				case "L":
					this.actions.push("camera_rotate_right");
					break;
				case "ArrowUp":
				case "k":
				case "w":
					this.actions.push(this.cameraCorrection("up"));
					break;
				case "ArrowDown":
				case "j":
				case "s":
					this.actions.push(this.cameraCorrection("down"));
					break;
				case "r":
					this.actions.push("rotate");
					break;
				case " ":
					this.actions.push("fall");
					break;
				default:
					break;
			}
		};
		document.addEventListener("keydown", keyUpHandler);
		this.currentKeyUpHandler = keyUpHandler;
	}

	setBrick(brick: Brick) {
		this.brick = brick;
	}

	applyActions() {
		if (!this.brick) {
			return;
		}
		if (!this.actions.length) {
			return;
		}
		const action = this.actions.pop();
		switch (action) {
			case "left":
				this.brick.move(-1, 0);
				break;
			case "right":
				this.brick.move(1, 0);
				break;
			case "up":
				this.brick.move(0, -1);
				break;
			case "down":
				this.brick.move(0, 1);
				break;
			case "fall":
				this.onFastForward();
				break;
			case "rotate":
				this.brick.rotate();
				break;
			case "camera_rotate_right":
				this.engine?.camera?.rotate("right");
				break;
			case "camera_rotate_left":
				this.engine?.camera?.rotate("left");
				break;
			default:
				break;
		}
		this.actions = [];
	}
}
