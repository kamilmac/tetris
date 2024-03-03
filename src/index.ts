import { Brick } from "./brick";
import { CFG } from "./config";
import { Controls } from "./controls";
import { Stage } from "./stage";
import { appState } from "./state";
import { Engine } from "./three/engine";
import * as amplitude from '@amplitude/analytics-browser';
import { isRunningInProduction } from "./utils/utils";

if (isRunningInProduction()) {
	amplitude.init('bf7d07521ce9c86ebc70a6d04a09a67d');
}

declare global {
	interface Window {
		__READY__: boolean;
	}
}

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
			appState.subscribe(["status"], (state) => {
				if (state.status === "playing") {
					this.onResetGame();
				}
			});
		});
	}

	onResetGame = () => {
		this.engine?.reset();
		this.controls?.reset();
		this.stage.reset();
		this.lastBlockStepTime = this.getClock();
		this.resetTempo();
		this.addBrick();
	};

	getClock() {
		const factor = this.fastForward ? 0.1 : 1;
		return Math.round(performance.now() / (this.stage.cycleTime * factor));
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

	processEndGame() {
		const isOverLimit = this.stage.lastLockedY >= CFG.stage.limit;
		const isPlaying = appState.state.status === "playing";
		const isInDemo = appState.state.status === "inDemo";
		const isPhysicsActive = (this.engine?.physics?.timeActive || 0) > 3000;

		if (!this.engine?.usePhysics && isOverLimit) {
			this.engine?.captureSceneWithPhysics();
			if (isPlaying) {
				appState.changeStatus("gameOver");
			}
		}

		if (isInDemo && isOverLimit && isPhysicsActive) {
			this.onResetGame();
		}
	}

	go = () => {
		this.controls?.applyActions();
		this.onNextStep(() => {
			if (this.engine?.usePhysics) {
				return;
			}
			this.brick?.fallStep();
			if (this.brick?.locked) {
				this.resetTempo();
				this.stage.checkForFilledLines();
				this.addBrick();
			}
		});
		this.engine?.animate();
		this.processEndGame();
		requestAnimationFrame(this.go);
	};
}

new Game();
