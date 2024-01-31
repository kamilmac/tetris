interface state {
  score: number;
  autoplay: boolean;
  menu: boolean;
  gameState: "playing" | "gameover";
}

interface sub {
  props: (keyof state)[];
  callback: (state: state) => void;
}

class State {
  state: state;
  subs: sub[];

  constructor() {
    this.state = {
      score: 0,
      menu: true,
      autoplay: false,
      gameState: "playing",
    };
    this.subs = [];
  }

  subscribe(props: sub["props"], callback: sub["callback"]) {
    this.subs.push({
      callback,
      props,
    });
  }

  addToScore(amount: number) {
    this.state.score += amount;
    this.onUpdate("score");
  }

  resetScore() {
    if (this.state.score === 0) {
      return;
    }
    this.state.score = 0;
    this.onUpdate("score");
  }

  menuOn() {
    if (this.state.menu) {
      return;
    }
    this.state.menu = true;
    this.onUpdate("menu");
  }

  menuOff() {
    if (!this.state.menu) {
      return;
    }
    this.state.menu = false;
    this.onUpdate("menu");
  }

  menuToggle() {
    this.state.menu ? this.menuOff() : this.menuOn();
  }

  changeGameState = (gameState: state["gameState"]) => {
    if (this.state.gameState === gameState) {
      return;
    }
    this.state.gameState = gameState;
    this.onUpdate("gameState");
    if (this.state.autoplay && gameState === "gameover") {
      setTimeout(() => {
        this.changeGameState("playing");
        appState.resetScore();
      }, 3000);
    }
  };

  onUpdate(prop: keyof state) {
    for (let i = 0; i < this.subs.length; i += 1) {
      const s = this.subs[i];
      if (s.props?.includes(prop)) {
        s.callback(this.state);
      }
    }
  }
}

export const appState = new State();
