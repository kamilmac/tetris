import { Game } from ".";
import { Brick } from "./brick";
import { appState } from "./state";
import { Engine } from "./three/engine";

const RANDOM_ACTIONS = [
  "left",
  "right",
  "up",
  "down",
  "left",
  "right",
  "up",
  "down",
  "fall",
  "fall",
  "rotate",
  "rotate",
  "rotate",
  "rotate",
  "camera_rotate_right",
  "camera_rotate_left",
];

export class Controls {
  actions: string[];
  private currentKeyUpHandler?: ((event: KeyboardEvent) => void) | null;
  activeCamera: number = 0;
  brick?: Brick;
  onFastForward: () => void;
  autoPlay: boolean = false;
  engine: Engine;
  onResetGame: Game;

  constructor(onResetGame, engine, onFastForward) {
    this.brick = undefined;
    this.onResetGame = onResetGame;
    this.engine = engine;
    this.onFastForward = onFastForward;
    this.addControls();
    this.actions = [];
    appState.subscribe(["autoplay"], (state) => {
      if (state.autoplay) {
        this.autoPlay = true;
      } else {
        this.autoPlay = false;
      }
    });
  }

  prependRandomAction() {
    const probablityPerFrame = 0.02;
    if (Math.random() < probablityPerFrame) {
      const randomAction =
        RANDOM_ACTIONS[Math.floor(Math.random() * RANDOM_ACTIONS.length)];
      this.actions.unshift(randomAction);
    }
  }

  cameraCorrection(action: string) {
    switch (this.engine.camera.activeCamera) {
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
        case "Enter":
          this.actions.push("restart");
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
    if (this.autoPlay) {
      this.prependRandomAction();
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
      case "restart":
        this.onResetGame();
        break;
      default:
        break;
    }
    this.actions = [];
  }
}
