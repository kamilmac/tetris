import { Stage } from "./stage";
import { Brick } from "./brick";
import { Engine } from "./three/engine";
import { Controls } from "./controls";
import { CFG } from "./config";
import { ScoreDisplay } from "./lit_components/score";
import { appState } from "./state";

customElements.define("score-display", ScoreDisplay);

class Game {
  stage: Stage;
  lastBlockStepTime?: number;
  engine?: Engine;
  controls?: Controls;
  brick?: Brick;
  fastForward: boolean = false;

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
      appState.subscribe(["gameState"], (state) => {
        if (state.gameState === "playing") {
          this.onResetGame();
        }
      });
    });
  }

  onResetGame = () => {
    this.engine.usePhysics = false;
    this.controls.actions = [];
    this.engine.camera.activeCamera = 0;
    this.engine.floor.hideWalls = false;
    this.resetTempo();
    this.addBrick();
    this.stage.init();
    this.engine.camera.initPosition();
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
      appState.changeGameState("gameover");
    }
    this.controls.applyActions();
    this.onNextStep(() => {
      if (this.engine.usePhysics) {
        return;
      }
      this.brick?.moveDown();
      if (this.brick?.locked) {
        this.resetTempo();
        this.stage.checkForFilledLines();
        this.addBrick();
      }
    });
    this.engine.animate();
    requestAnimationFrame(this.go);
  };
}

new Game();
