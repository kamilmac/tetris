export class Controls {
  constructor() {
    this.addControls()
    this.actions = [];
    window.paused = false;
  }

  addControls() {
    if (this.currentKeyUpHandler) {
      document.removeEventListener('keydown', this.currentKeyUpHandler);
      this.currentKeyUpHandler = null;
    }

    const keyUpHandler = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.actions.push('left');
          break;
        case 'ArrowRight':
          this.actions.push('right');
          break;
        case 'ArrowUp':
          this.actions.push('up');
          break;
        case 'ArrowDown':
          this.actions.push('down');
          break;
        case 'r':
          this.actions.push('rotate');
          break;
        case ' ':
          this.actions.push('fall');
          break;
        case 'p':
          window.paused = !window.paused;
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', keyUpHandler);
    this.currentKeyUpHandler = keyUpHandler;
  }

  applyActions(brick) {
    this.actions.forEach((action) => {
      switch (action) {
        case 'left':
          brick.move(-1, 0);
          break;
        case 'right':
          brick.move(1, 0);
          break;
        case 'up':
          brick.move(0, -1);
          break;
        case 'down':
          brick.move(0, 1);
          break;
        case 'fall':
          brick.moveDown();
          break;
        case 'rotate':
          brick.rotate();
          break;
        default:
          break;
      }
    });
    this.actions = [];
  }
}

