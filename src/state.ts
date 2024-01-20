interface state {
  score: number;
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
    this.state.score = 0;
    this.onUpdate("score");
  }

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
