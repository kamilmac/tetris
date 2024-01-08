import { Stage } from "./stage";
import { Brick } from "./brick";
import { Engine } from "./engine";
import { Controls } from "./controls";

export const CFG = {
  colors: [
    0x1a1b26, 0x414868, 0xbb9af7, 0x7dcfff, 0x9ece6a, 0xff9e64, 0xf7768e,
  ],
  cycleTime: 400,
  shapes: [],
  stage: {
    width: 8,
    height: 12,
  },
  controls: {
    cameraRotateRight: "d",
    cameraRotateLeft: "s",
    moveBlockLeft: "ArrowLeft",
    moveBlockRight: "ArrowRight",
    moveBlockDown: "ArrowDown",
    moveBlockRotate: "ArrowUp",
  },
};

const CYCLE_LENGTH_MS = CFG.cycleTime;

class Game {
  constructor() {
    this.blockCyclesCount = 1;
    this.stage = new Stage(CFG.stage.height, CFG.stage.width, CFG.stage.width);
    this.engine = new Engine(this.stage, () => {
      this.controls = new Controls(CFG.controls);
      this.addBrick();
      this.loop();
    });
  }

  onCycleBlocks(callback) {
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
    this.controls.applyActions(this.brick);
    this.onCycleBlocks(() => {
      if (window.paused) return;
      this.brick.moveDown();
      this.stage.checkForFilledLines();
      if (this.brick.locked) {
        this.addBrick();
      }
    });
    this.engine.render();
    requestAnimationFrame(this.loop);
  };
}

new Game();
