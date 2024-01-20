interface state {
  score: number;
}

interface sub {
  callback: (v: state | state[keyof state]) => void;
  prop: keyof state | undefined;
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

  subscribe(callback: sub["callback"], prop?: sub["prop"]) {
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

  onUpdate(prop?: sub["prop"]) {
    for (let i = 0; i < this.subs.length; i += 1) {
      const s = this.subs[i];
      if (prop && s.prop === prop) {
        s.callback(this.state[s.prop]);
      } else {
        s.callback(this.state);
      }
    }
  }
}

export const appState = new State();
