import { Stage } from "./stage";
import { Brick } from "./brick";
import { Engine } from "./three/engine";
import { Controls } from "./controls";
import { CFG } from "./config";

class Game {
  blockCyclesCount: number;
  stage: Stage;
  engine?: Engine;
  controls?: Controls;
  brick?: Brick;

  constructor() {
    this.blockCyclesCount = 1;
    this.stage = new Stage(CFG.stage.height, CFG.stage.width, CFG.stage.depth);
    new Engine(this.stage, (engine: Engine) => {
      this.engine = engine;
      this.controls = new Controls(engine);
      this.addBrick();
      this.go();
    });
  }

  onCycleBlocks(callback: () => void) {
    const t = Math.round(performance.now() / 100) * 100;
    if (t % (CFG.cycleTime * this.blockCyclesCount) === 0) {
      callback();
      this.blockCyclesCount += 1;
    }
  }

  addBrick() {
    if (this.stage.lastLockedY > 2) {
      return;
    }
    this.brick = new Brick(this.stage);
    this.controls.setBrick(this.brick);
  }

  go = () => {
    if (this.stage.lastLockedY > 2) {
      if (!this.pa) {
        this.engine?.attachPhysics();
        this.pa = true;
      }
      this.engine.world?.step(1 / 60);
      this.engine.gophys()
      this.controls.applyActions();
      this.engine.render();
      requestAnimationFrame(this.go);
      return;
    }
    if (!this.brick || !this.engine || !this.controls) {
      return;
    }
    this.controls.applyActions();
    this.onCycleBlocks(() => {
      if (!this.engine.camera.cameraInMotion) {
        this.brick?.moveDown();
      }
      this.stage.checkForFilledLines();
      if (this.brick?.locked) {
        this.addBrick();
      }
    });
    this.engine.render();
    requestAnimationFrame(this.go);
  };
}

new Game();
