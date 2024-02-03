import { Brick } from "./brick";
import { CFG } from "./config";
import { Controls } from "./controls";
import { Stage } from "./stage";
import { appState } from "./state";
import { Engine } from "./three/engine";

class Game {
	stage: Stage;
	lastBlockStepTime?: number;
	engine?: Engine;
	controls?: Controls;
	brick?: Brick;
	fastForward = false;

	constructor() {
		this.stage = new Stage(CFG.stage.height, CFG.stage.width, CFG.stage.depth);
		new Engine(this.stage, (engine: Engine) => {
			this.engine = engine;
			this.controls = new Controls(this.onResetGame, engine, () => {
				this.fastForward = true;
			});
			this.lastBlockStepTime = this.getClock();
			this.addBrick();
			this.go();
			// this.engine.camera.shiftSceneToRight();
		});
	}

	onResetGame = () => {
		this.engine?.reset();
		this.controls?.reset();
		this.resetTempo();
		this.addBrick();
		this.stage.reset();
	};

	getClock() {
		const factor = this.fastForward ? 0.1 : 1;
		return Math.round(performance.now() / (CFG.cycleTime * factor));
	}

	onNextStep(callback: () => void) {
		const t = this.getClock();
		// @ts-ignore
		if (t > this.lastBlockStepTime) {
			this.lastBlockStepTime = t;
			if (!this.engine?.camera?.cameraInMotion) {
				callback();
			}
		}
	}

	resetTempo() {
		if (this.fastForward) {
			this.fastForward = false;
			this.lastBlockStepTime = this.getClock();
		}
	}

	addBrick() {
		this.brick = new Brick(this.stage);
		this.controls?.setBrick(this.brick);
	}

	go = () => {
		if (this.stage.lastLockedY >= CFG.stage.limit) {
			this.engine?.captureSceneWithPhysics();
			appState.changeStatus("gameOver");
		}
		this.controls?.applyActions();
		this.onNextStep(() => {
			if (this.engine?.usePhysics) {
				return;
			}
			this.brick?.moveDown();
			if (this.brick?.locked) {
				this.resetTempo();
				this.stage.checkForFilledLines();
				this.addBrick();
			}
		});
		this.engine?.animate();
		requestAnimationFrame(this.go);
	};
}

new Game();
