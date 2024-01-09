import { Stage } from "./stage";
import { Brick } from "./brick";
import { Engine } from "./engine";
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
  engine: Engine;
  controls?: Controls;
  brick?: Brick;

  constructor() {
    this.blockCyclesCount = 1;
    this.stage = new Stage(CFG.stage.height, CFG.stage.width, CFG.stage.width);
    this.engine = new Engine(this.stage, () => {
      this.controls = new Controls();
      this.addBrick();
      this.loop();
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

  loop = () => {
    this.controls?.applyActions(this.brick);
    this.onCycleBlocks(() => {
      if (window.paused) return;
      this.brick?.moveDown();
      this.stage.checkForFilledLines();
      if (this.brick?.locked) {
        this.addBrick();
      }
    });
    this.engine.render();
    requestAnimationFrame(this.loop);
  };
}

new Game();
