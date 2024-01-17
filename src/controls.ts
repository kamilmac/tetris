import { Brick } from "./brick";

export class Controls {
  private actions: string[];
  private currentKeyUpHandler?: ((event: KeyboardEvent) => void) | null;
  activeCamera: number = 0;
  brick?: Brick;

  constructor(engine) {
    this.brick = undefined;
    this.engine = engine;
    this.addControls();
    this.actions = [];
    window.paused = false;
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
      default: return action;
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
        case "ArrowRight":
        case "l":
        case "d":
          if (event.shiftKey) {
            this.actions.push("camera_rotate_right");
          } else {
            this.actions.push(this.cameraCorrection("right"));
          }
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
        case "p":
          window.paused = !window.paused;
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
    if (!this.brick) { return; }
    // HACK FOR CRASHING GAME WHILE MULTPLE ACTIONS ARE PRESSED
    this.actions = this.actions.slice(0, 1);
    this.actions.forEach((action) => {
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
          this.brick.moveDown();
          break;
        case "rotate":
          this.brick.rotate();
          break;
        case "camera_rotate_right":
          this.engine.camera.rotate("right");
          break;
        case "camera_rotate_left":
          this.engine.camera.rotate("left");
          break;
        default:
          break;
      }
    });
    this.actions = [];
  }
}
