import { Stage } from "./stage";
import { Brick } from "./brick";
import { Engine } from "./engine";
import { Controls } from "./controls";

const CYCLE_LENGTH_MS = 400;

class Game {
  constructor() {
    this.blockCyclesCount = 1;
    this.stage = new Stage(12, 8, 8);
    this.engine = new Engine(this.stage, () => {
      this.controls = new Controls();
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

export const CFG = {
  colors: {
    active: "",
    locked: "",
    floor: "",
  },
  cycleTime: 800,
  shapes: [],
  stage: {
    width: 8,
    height: 8,
    height: 12,
  },
  controls: {
    left: "ArrowLeft",
    right: "ArrowRight",
    down: "ArrowDown",
    rotate: "ArrowUp",
  },
};
