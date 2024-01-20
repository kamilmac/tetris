interface state {
  score: number;
}

interface sub {
  prop: keyof state;
  callback: (state: state[keyof state]) => void;
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

  subscribe(prop: sub["prop"], callback: sub["callback"]) {
    this.subs.push({
      callback,
      prop,
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

  onUpdate(prop: sub["prop"]) {
    for (let i = 0; i < this.subs.length; i += 1) {
      const s = this.subs[i];
      if (s.prop === prop) {
        s.callback(this.state[s.prop]);
      }
    }
  }
}

export const appState = new State();
