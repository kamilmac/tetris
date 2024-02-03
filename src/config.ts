import * as THREE from "three";

const FLOOR_SIZE = 6;

export interface CubeType {
	faceColors: {
		topBottom: THREE.Color;
		frontBack: THREE.Color;
		leftRight: THREE.Color;
	};
	edge?: {
		thickness: number;
		color: THREE.Color;
	};
	scale?: number;
	pattern?: "A" | "B" | "C";
}

const c = (color: number | string): THREE.Color => {
	if (typeof color === "string") {
		const [h, s, l] = color
			.replace(/[^0-9,]/g, "")
			.split(",")
			.map((s) => Number(s));
		return new THREE.Color().setHSL(h / 360, s / 100, l / 100, "srgb");
	}
	if (typeof color === "number") {
		return new THREE.Color().setHex(color);
	}
	return new THREE.Color();
};

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
			topBottom: c(0xffffff),
			frontBack: c(0xffffff),
			leftRight: c(0xffffff),
		},
		edge: {
			thickness: 0.03,
			color: c(0x222222),
		},
		scale: 0.9,
	},
	dante_p: {
		faceColors: {
			topBottom: c(0xdddddd),
			frontBack: c(0xdddddd),
			leftRight: c(0xdddddd),
		},
		edge: {
			thickness: 0.0,
			color: c(0x666666),
		},
		scale: 0.9,
		pattern: "A",
	},
	reda: {
		faceColors: {
			topBottom: c("hsl(13, 100%, 28%)"),
			frontBack: c("hsl(13, 100%, 48%)"),
			leftRight: c("hsl(13, 100%, 68%)"),
		},
		edge: {
			thickness: 0.0,
			color: c(0x888888),
		},
		scale: 1,
		pattern: "A",
	},
	polmot: {
		faceColors: {
			topBottom: c("hsl(0, 0%, 10%)"),
			frontBack: c("hsl(0, 0%, 30%)"),
			leftRight: c("hsl(0, 0%, 40%)"),
		},
		edge: {
			thickness: 0.0,
			color: c(0x888888),
		},
		scale: 1,
		pattern: "A",
	},
	trolja: {
		faceColors: {
			topBottom: c("hsl(13, 100%, 48%)"),
			frontBack: c("hsl(13, 100%, 66%)"),
			leftRight: c("hsl(13, 100%, 86%)"),
		},
		edge: {
			thickness: 0.0,
			color: c(0x888888),
		},
		scale: 1,
		pattern: "A",
	},
};

export const CFG = {
	background: {
		color: "hsl(0, 0%,10%)",
	},
	enclosue: {
		color: c("hsl(0, 0%, 14%)"),
	},
	cubes: {
		active: "dante",
		locked: ["reda", "polmot", "trolja"],
	},
	colors: {
		activeCube: 0xefefef,
		lockedRows: [0xff0000, 0x00ff00, 0x0000ff],
		floor: 0xcc8822,
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
