interface state {
  score: number;
  autoplay: boolean;
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
      autoplay: true,
      gameState: "playing",
    };
    this.subs = [];
  }

  subscribe(props: sub["props"], callback: sub["callback"]) {
    this.subs.push({
      callback,
      props,
    });
    callback(this.state);
  }

  addToScore(amount: number) {
    this.state.score += amount;
    this.onUpdate("score");
  }

  resetScore() {
    this.state.score = 0;
    this.onUpdate("score");
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

console.log(`App version: ${APP_VERSION}`);
export const appState = new State();
