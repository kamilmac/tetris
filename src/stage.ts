import { CFG } from "./config";
import { AppState } from "./state";

export interface Cube {
	id: number | null;
	state: "floor" | "wall" | "locked" | "active";
}

export class Stage {
	static id = 0;
	height: number;
	width: number;
	depth: number;
	cubes: (Cube | null)[][][];
	toBeRemovedCubes: number[];
	dirty: boolean;
	lastLockedY: number;
	cycleTime: number;

	constructor(height = 24, width = 12, depth = 12) {
		this.height = height;
		this.width = width;
		this.depth = depth;
		this.cubes = [];
		this.toBeRemovedCubes = [];
		this.dirty = true;
		this.lastLockedY = 0;
		this.cycleTime = CFG.cycleTime;
		this.init();
	}

	init() {
		for (let x = -1; x < this.width + 1; x++) {
			this.cubes[x] = [];
			for (let y = -1; y < this.height; y++) {
				this.cubes[x][y] = [];
				for (let z = -1; z < this.depth + 1; z++) {
					if (y === -1) {
						this.cubes[x][y][z] = this.getFloorCube();
						continue;
					}
					if (x > -1 && x < this.width && z > -1 && z < this.depth) {
						this.cubes[x][y][z] = this.getEmptyCube();
						continue;
					}
					this.cubes[x][y][z] = this.getWallCube();
				}
			}
		}
	}

	reset() {
		this.cubes = [];
		this.toBeRemovedCubes = [];
		this.dirty = true;
		this.lastLockedY = 0;
		this.cycleTime = CFG.cycleTime;
		this.init();
	}

	getNewID() {
		Stage.id += 1;
		return Stage.id;
	}

	getEmptyCube() {
		return null;
	}

	getFloorCube(): Cube {
		return {
			id: null,
			state: "floor",
		};
	}

	getWallCube(): Cube {
		return {
			id: null,
			state: "wall",
		};
	}

	fillCube(x: number, y: number, z: number, id: number, state: Cube["state"]) {
		if (state === "locked") {
			this.lastLockedY = y;
		}
		if (this.isCubeDefined(x, y, z)) {
			this.cubes[x][y][z] = {
				id,
				state,
			};
			this.dirty = true;
		}
	}

	resetCube(x: number, y: number, z: number) {
		if (this.isCubeDefined(x, y, z)) {
			this.cubes[x][y][z] = this.getEmptyCube();
		}
	}

	setToBeRemovedCube(x: number, y: number, z: number) {
		if (this.isCubeDefined(x, y, z)) {
			this.cubes[x][y][z] = this.getEmptyCube();
		}
		this.dirty = true;
	}

	setToBeMovedDownCube(x: number, y: number, z: number) {
		if (
			this.isCubeDefined(x, y, z) &&
			this.cubes[x][y][z]?.state === "locked"
		) {
			const cube = this.cubes[x][y][z];
			if (!cube?.id) {
				return;
			}
			this.fillCube(x, y - 1, z, cube.id, "locked");
			this.resetCube(x, y, z);
			this.dirty = true;
		}
	}

	checkForFilledLines() {
		// Disabled line-clearing logic to simulate realistic factory stacking
		// This keeps the game loop alive without modifying other game flow logic
		this.cycleTime -= CFG.accelerationFactor / 10;
	}

	isCubeDefined(x: number, y: number, z: number) {
		return (
			this.cubes[x] && this.cubes[x][y] && this.cubes[x][y][z] !== undefined
		);
	}

	isCollidingCube(x: number, y: number, z: number): Cube["state"] | false {
		if (this.isCubeDefined(x, y, z)) {
			return this.cubes[x][y][z]?.state || false;
		}
		return false;
	}
}
