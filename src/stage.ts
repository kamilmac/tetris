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

	// TODO: pass array of cubes instead here
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
		this.toBeRemovedCubes = [];
		const xLines = [];
		const zLines = [];
		let localScore = 0;

		for (let x = 0; x < this.width; x++) {
			zLines[x] = true;
			for (let z = 0; z < this.depth; z++) {
				if (this.cubes[x][this.lastLockedY][z]?.state !== "locked") {
					zLines[x] = false;
					break;
				}
			}
		}

		for (let z = 0; z < this.depth; z++) {
			xLines[z] = true;
			for (let x = 0; x < this.width; x++) {
				if (this.cubes[x][this.lastLockedY][z]?.state !== "locked") {
					xLines[z] = false;
					break;
				}
			}
		}

		const toBeMovedDown: Record<string, number[]> = {};

		zLines.forEach((n, index) => {
			if (n) {
				localScore += this.width;
				for (let z = 0; z < this.depth; z++) {
					this.setToBeRemovedCube(index, this.lastLockedY, z);
					for (let y = this.lastLockedY + 1; y < this.height; y++) {
						if (this.cubes[index][y][z]?.state === "locked") {
							toBeMovedDown[`${index}-${y}-${z}`] = [index, y, z];
						}
					}
				}
			}
		});

		xLines.forEach((n, index) => {
			if (n) {
				localScore += this.depth;
				for (let x = 0; x < this.width; x++) {
					this.setToBeRemovedCube(x, this.lastLockedY, index);
					for (let y = this.lastLockedY + 1; y < this.height; y++) {
						if (this.cubes[x][y][index]?.state === "locked") {
							toBeMovedDown[`${x}-${y}-${index}`] = [x, y, index];
						}
					}
				}
			}
		});

		if (localScore > 0) {
			AppState.addToScore(localScore);
			this.cycleTime -= CFG.accelerationFactor;
		}

		for (const key of Object.keys(toBeMovedDown)) {
			this.setToBeMovedDownCube(
				toBeMovedDown[key][0],
				toBeMovedDown[key][1],
				toBeMovedDown[key][2],
			);
		}
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
