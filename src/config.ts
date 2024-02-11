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
	pattern: "A" | "B" | "C" | "";
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
			thickness: 0.3,
			color: "#222222",
		},
		pattern: "",
		scale: 0.9,
	},
	reda: {
		faceColors: {
			topBottom: "#dddddd",
			frontBack: "#888888",
			leftRight: "#dddddd",
		},
		edge: {
			thickness: 0.0,
			color: "#888888",
		},
		scale: 1,
		pattern: "A",
	},
	trolja: {
		faceColors: {
			topBottom: "#dddddd",
			frontBack: "#dddddd",
			leftRight: "#dddddd",
		},
		edge: {
			thickness: 0.0,
			color: "#888888",
		},
		scale: 1,
		pattern: "A",
	},
};

export const CFG = {
	background: {
		color: "#333333",
	},
	enclosure: {
		color: "#cccccc",
	},
	cubes: {
		active: "dante",
		locked: ["reda", "trolja"],
	},
	shadow: {
		thickness: 0.02,
		color: "#444444",
	},
	cycleTime: 440,
	accelerationFactor: 15,
	shapes: [],
	stage: {
		width: FLOOR_SIZE,
		depth: FLOOR_SIZE,
		height: 8,
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
		max: 0.5,
		value: 0.01,
		label: "Edge thickness",
	});
	f.addBinding(cubeVariants[variant], "pattern", {
		options: {
			none: "",
			A: "A",
			B: "B",
			C: "C",
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

	const general = TPane.addFolder({
		title: "General",
	});
	general.addBinding(CFG.background, "color", { label: "Background" });

	createCubeVariantBinding("dante");
	createCubeVariantBinding("reda");
	createCubeVariantBinding("trolja");

	// TPane.importState(JSON.parse(sessionStorage.getItem('tpstate') || '{}'));

	TPane.on("change", () => {
		const state = TPane.exportState();
		sessionStorage.setItem("tpstate", JSON.stringify(state));
	});
}
