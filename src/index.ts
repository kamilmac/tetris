import { Stage } from "./stage";
import { Brick } from "./brick";
import { Engine } from "./three/engine";
import { Controls } from "./controls";
import { CFG } from "./config";

// Extend window interface to include paused (if it's globally set elsewhere in your code)
declare global {
  interface Window {
    paused: boolean;
  }
}

const CYCLE_LENGTH_MS = CFG.cycleTime;

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
      this.startGame();
    });
  }

  onCycleBlocks(callback: () => void) {
    const t = Math.round(performance.now() / 100) * 100;
    if (t % (CYCLE_LENGTH_MS * this.blockCyclesCount) === 0) {
      callback();
      this.blockCyclesCount += 1;
    }
  }

  addBrick() {
    this.brick = new Brick(this.stage);
  }

  startGame = () => {
    if (!this.brick || !this.engine || !this.controls) {
      return;
    }
    this.controls.applyActions(this.brick);
    this.onCycleBlocks(() => {
      if (window.paused) return;
      this.brick?.moveDown();
      this.stage.checkForFilledLines();
      if (this.brick?.locked) {
        this.addBrick();
      }
    });
    this.engine.render();
    requestAnimationFrame(this.startGame);
  };
}

new Game();
