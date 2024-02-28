import { Pane } from "tweakpane";
import { isTweakPaneActive } from "./utils/utils";

const FLOOR_SIZE = 6;

export interface CubeType {
	faceColors: {
		topBottom: string;
		frontBack: string;
		leftRight: string;
	};
	edge: {
		thickness: number;
		color: string;
	};
	scale: number;
	pattern: number;
	patternScale: number;
	patternFaceConfig: "V" | "H" | "VH";
	patternPositionRandomness: number;
	patternFactor: number;
}

const controls = {
	left: new KeyboardEvent("keydown", {
		key: "ArrowLeft",
		code: "ArrowLeft",
		shiftKey: false,
	}),
	right: new KeyboardEvent("keydown", {
		key: "ArrowRight",
		code: "ArrowRight",
		shiftKey: false,
	}),
	up: new KeyboardEvent("keydown", {
		key: "ArrowUp",
		code: "ArrowUp",
		shiftKey: false,
	}),
	down: new KeyboardEvent("keydown", {
		key: "ArrowDown",
		code: "ArrowDown",
		shiftKey: false,
	}),
	fall: new KeyboardEvent("keydown", {
		key: " ",
		code: "Space",
		shiftKey: false,
	}),
	rotate: new KeyboardEvent("keydown", {
		key: "r",
		code: "KeyR",
		shiftKey: false,
	}),
	camera_rotate_right: new KeyboardEvent("keydown", {
		key: "ArrowRight",
		code: "ArrowRight",
		shiftKey: true,
	}),
	camera_rotate_left: new KeyboardEvent("keydown", {
		key: "ArrowLeft",
		code: "ArrowLeft",
		shiftKey: true,
	}),
};

export const cubeVariants: Record<string, CubeType> = {
	dante: {
		faceColors: {
			topBottom: "#ffffff",
			frontBack: "#ffffff",
			leftRight: "#ffffff",
		},
		edge: {
			thickness: 0.02,
			color: "#222222",
		},
		pattern: 2,
		patternFactor: -1.0,
		patternScale: 0.32,
		patternPositionRandomness: 0.14,
		patternFaceConfig: "VH",
		scale: 0.9,
	},
	reda: {
		faceColors: {
			topBottom: "#f7768e",
			frontBack: "#da677d",
			leftRight: "#ff94a8",
		},
		edge: {
			thickness: 0.0,
			color: "#888888",
		},
		scale: 1,
		pattern: 2,
		patternFactor: -0.93,
		patternScale: 0.45,
		patternPositionRandomness: 0.11,
		patternFaceConfig: "VH",
	},
	trolja: {
		faceColors: {
			topBottom: "#4375c3",
			frontBack: "#3d6097",
			leftRight: "#5f8dd7",
		},
		edge: {
			thickness: 0.0,
			color: "#888888",
		},
		scale: 1,
		pattern: 2,
		patternFactor: -0.31,
		patternScale: 0.205,
		patternPositionRandomness: 0.11,
		patternFaceConfig: "VH",
	},
	havre: {
		faceColors: {
			topBottom: "#ff9e64",
			frontBack: "#e68e59",
			leftRight: "#ffb182",
		},
		edge: {
			thickness: 0.0,
			color: "#888888",
		},
		scale: 1,
		pattern: 2,
		patternFactor: -1.0,
		patternScale: 0.62,
		patternPositionRandomness: 0.11,
		patternFaceConfig: "VH",
	},
};

export const CFG = {
	background: {
		color: "#1a1b26",
	},
	enclosure: {
		color: "#1b1f36",
		noiseFactor: 0.17,
	},
	cubes: {
		active: "dante",
		locked: ["reda", "trolja", "havre"],
	},
	shadow: {
		thickness: 0.02,
		color: "#444444",
	},
	cycleTime: 480,
	accelerationFactor: 15,
	shapes: [],
	stage: {
		width: FLOOR_SIZE,
		depth: FLOOR_SIZE,
		height: 10,
		limit: 4,
	},
	controls,
};

export const TPane = isTweakPaneActive()
	? new Pane({ title: "Styling" })
	: null;

const createCubeVariantBinding = (variant: string) => {
	if (!TPane) {
		return;
	}
	const f = TPane.addFolder({
		title: `Cube ${variant}`,
	});
	f.addBinding(cubeVariants[variant].faceColors, "leftRight");
	f.addBinding(cubeVariants[variant].faceColors, "topBottom");
	f.addBinding(cubeVariants[variant].faceColors, "frontBack");
	f.addBinding(cubeVariants[variant].edge, "color", {
		label: "Edge color",
	});
	f.addBinding(cubeVariants[variant].edge, "thickness", {
		min: 0,
		max: 0.2,
		step: 0.01,
		label: "Edge thickness",
	});
	f.addBinding(cubeVariants[variant], "pattern", {
		min: 0,
		max: 16,
		step: 1,
		label: "Pattern",
	});
	f.addBinding(cubeVariants[variant], "patternFactor", {
		min: -1.0,
		max: 1.0,
		step: 0.01,
		label: "Pattern factor",
	});
	f.addBinding(cubeVariants[variant], "patternScale", {
		min: 0.005,
		max: 1.0,
		step: 0.005,
		label: "Pattern scale",
	});
	f.addBinding(cubeVariants[variant], "patternPositionRandomness", {
		min: 0.0,
		max: 1.0,
		value: 0.005,
		label: "Pattern randomness",
	});
	f.addBinding(cubeVariants[variant], "patternFaceConfig", {
		options: {
			V: "V",
			H: "H",
			VH: "VH",
		},
	});
	f.addBinding(cubeVariants[variant], "scale", {
		min: 0.6,
		max: 1.0,
		value: 0.01,
	});
};

if (TPane) {
	const enclosure = TPane.addFolder({
		title: "Enclosure",
	});
	enclosure.addBinding(CFG.enclosure, "color");
	enclosure.addBinding(CFG.enclosure, "noiseFactor", {
		min: -1.0,
		max: 1.0,
		step: 0.01,
		label: "Pattern factor",
	});

	const general = TPane.addFolder({
		title: "General",
	});
	general.addBinding(CFG.background, "color", { label: "Background" });

	createCubeVariantBinding("dante");
	createCubeVariantBinding("reda");
	createCubeVariantBinding("trolja");
	createCubeVariantBinding("havre");

	TPane.importState(JSON.parse(sessionStorage.getItem("tpstate") || "{}"));

	TPane.on("change", () => {
		const state = TPane.exportState();
		sessionStorage.setItem("tpstate", JSON.stringify(state));
	});
}
