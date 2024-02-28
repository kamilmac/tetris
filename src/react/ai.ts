import { CFG } from "../config";
import { appState } from "../state";

const RANDOM_ACTIONS: (keyof typeof CFG.controls)[] = [
	"left",
	"right",
	"up",
	"down",
	"left",
	"right",
	"up",
	"down",
	"left",
	"right",
	"up",
	"down",
	"fall",
	"fall",
	"fall",
	"rotate",
	"rotate",
	"rotate",
	"rotate",
	"camera_rotate_right",
	"camera_rotate_left",
];

export const initAI = () => {
	setInterval(() => {
		if (appState.state.status !== "inDemo") {
			return;
		}
		const chance = 0.1;
		if (Math.random() < chance) {
			const randomAction =
				RANDOM_ACTIONS[Math.floor(Math.random() * RANDOM_ACTIONS.length)];
			const event = CFG.controls[randomAction];
			if (!event) {
				return;
			}
			document.dispatchEvent(event);
		}
	}, 30);
};
