import { Brick } from "./brick";

export class Controls {
  private actions: string[];
  private currentKeyUpHandler?: ((event: KeyboardEvent) => void) | null;

  constructor(engine) {
    this.engine = engine;
    this.addControls();
    this.actions = [];
    window.paused = false;
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
            this.actions.push("left");
          }
          break;
        case "ArrowRight":
        case "l":
        case "d":
          if (event.shiftKey) {
            this.actions.push("camera_rotate_right");
          } else {
            this.actions.push("right");
          }
          break;
        case "ArrowUp":
        case "k":
        case "w":
          this.actions.push("up");
          break;
        case "ArrowDown":
        case "j":
        case "s":
          this.actions.push("down");
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

  applyActions(brick: Brick) {
    this.actions.forEach((action) => {
      switch (action) {
        case "left":
          brick.move(-1, 0);
          break;
        case "right":
          brick.move(1, 0);
          break;
        case "up":
          brick.move(0, -1);
          break;
        case "down":
          brick.move(0, 1);
          break;
        case "fall":
          brick.moveDown();
          break;
        case "rotate":
          brick.rotate();
          break;
        case "camera_rotate_right":
          console.log(this.engine)
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
