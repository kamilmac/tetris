import { Stage } from "./stage";
import { Brick } from "./brick";
import { Engine } from "./three/engine";
import { Controls } from "./controls";
import { CFG } from "./config";
import { ScoreDisplay } from "./lit_components/score";

customElements.define("score-display", ScoreDisplay);

class Game {
  lastBlockStepTime: number;
  stage: Stage;
  engine?: Engine;
  controls?: Controls;
  brick?: Brick;

  constructor() {
    this.stage = new Stage(CFG.stage.height, CFG.stage.width, CFG.stage.depth);
    new Engine(this.stage, (engine: Engine) => {
      this.engine = engine;
      this.controls = new Controls(engine);
      this.lastBlockStepTime = this.getClock();
      this.addBrick();
      this.go();
    });
  }

  getClock() {
    return Math.round(performance.now() / CFG.cycleTime);
  }

  onNextStep(callback: () => void) {
    const t = this.getClock();
    if (t > this.lastBlockStepTime) {
      this.lastBlockStepTime = t;
      if (!this.engine.camera.cameraInMotion) {
        callback();
      }
    }
  }

  addBrick() {
    this.brick = new Brick(this.stage);
    this.controls.setBrick(this.brick);
  }

  go = () => {
    if (this.stage.lastLockedY >= CFG.stage.limit) {
      this.engine?.captureSceneWithPhysics();
    }
    this.controls.applyActions();
    this.onNextStep(() => {
      if (this.engine.usePhysics) {
        return;
      }
      this.brick?.moveDown();
      this.stage.checkForFilledLines();
      if (this.brick?.locked) {
        this.addBrick();
      }
    });
    this.engine.animate();
    requestAnimationFrame(this.go);
  };
}

new Game();
