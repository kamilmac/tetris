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
	cycleTime: 500,
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
