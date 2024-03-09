type Status =
	| "loading"
	| "inDemo"
	| "countingDown"
	| "playing"
	| "pause"
	| "gameOver";

interface state {
	score: number;
	bestScore: number;
	autoplay: boolean;
	menu: boolean;
	status: Status;
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
			bestScore: parseInt(localStorage.getItem("bestScore") || "0"),
			menu: true,
			autoplay: true,
			status: "inDemo",
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
		if (this.state.status !== "playing") {
			return;
		}
		this.state.score += amount;
		if (this.state.score > this.state.bestScore) {
			this.state.bestScore = this.state.score;
			localStorage.setItem("bestScore", this.state.score.toString());
			this.onUpdate("bestScore");
		}
		this.onUpdate("score");
	}

	resetScore() {
		if (this.state.score === 0) {
			return;
		}
		this.state.score = 0;
		this.onUpdate("score");
	}

	changeStatus = (status: Status) => {
		if (this.state.status === status) {
			return;
		}
		if (status === "playing") {
			this.resetScore();
		}
		this.state.status = status;
		this.onUpdate("status");
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

export const AppState = new State();
