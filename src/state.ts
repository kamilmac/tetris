class state {
  state: {
    score: number;
  };
  subs: any[] = [];

  constructor() {
    this.state = {
      score: 0,
    };
  }

  subscribe(cb: () => void) {
    this.subs.push(cb);
  }

  addToScore(amount: number) {
    console.log("added!");
    this.state.score += amount;
    this.onUpdate();
  }

  resetScore() {
    this.state.score = 0;
    this.onUpdate();
  }

  onUpdate() {
    this.subs.forEach((s) => s(this.state));
  }
}

export const appState = new state();
