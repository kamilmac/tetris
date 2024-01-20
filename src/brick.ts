import { Stage } from "./stage";

interface BrickCube {
  position: number[];
  id: number;
  locked: boolean;
}

export class Brick {
  stage: Stage;
  locked: boolean;
  cubes: BrickCube[];

  static SHAPES = [
    [[1], [1], [1, 1]],
    [
      [1, 1],
      [1, 1],
    ],
    [[1], [1, 1]],
    [[1], [1, 1], [0, 1]],
    [[0, 1], [1, 1], [1]],
    [[1], [1], [1], [1]],
    [[1], [1], [1]],
    [[1], [1, 1], [1]],
    [[1], [1]],
    [[1, 1]],
  ];

  constructor(stage: Stage) {
    this.stage = stage;
    this.locked = false;
    this.cubes = [];
    this.create();
  }

  lock() {
    this.locked = true;
    this.cubes.forEach((cube) => {
      cube.locked = true;
    });
  }

  move(x: number, z: number) {
    if (this.locked) return;
    const newPosition = this.cubes.map((cube) => [
      cube.position[0] + x,
      cube.position[1],
      cube.position[2] + z,
    ]);
    this.clearFromStage();
    if (!this.isColliding(newPosition)) {
      this.applyNewPosition(newPosition);
      this.updateStage();
    }
  }

  moveDown() {
    if (this.locked) return;
    this.clearFromStage();
    const newPosition = this.cubes.map((cube) => [
      cube.position[0],
      cube.position[1] - 1,
      cube.position[2],
    ]);
    if (this.isColliding(newPosition)) {
      this.lock();
    } else {
      this.applyNewPosition(newPosition);
    }
    this.updateStage();
  }

  applyNewPosition(newPosition: number[][]) {
    for (let index = 0; index < this.cubes.length; index += 1) {
      this.cubes[index].position[0] = newPosition[index][0];
      this.cubes[index].position[1] = newPosition[index][1];
      this.cubes[index].position[2] = newPosition[index][2];
    }
  }

  getCubesPositions() {
    const cubesPositions = [];
    for (let i = 0; i < this.cubes.length; i += 1) {
      cubesPositions[i] = [
        this.cubes[i].position[0],
        this.cubes[i].position[1],
        this.cubes[i].position[2],
      ];
    }
    return cubesPositions;
  }

  isColliding(newPosition: number[][]) {
    const collisions = [];
    for (let i = 0; i < newPosition.length; i++) {
      const colliding = this.stage.isCollidingCube(
        newPosition[i][0],
        newPosition[i][1],
        newPosition[i][2],
      );
      if (colliding) {
        collisions.push(colliding);
      }
    }
    if (collisions.length) {
      return collisions;
    }
    return false;
  }

  rotate() {
    if (this.locked) return;
    this.clearFromStage();
    // Find the pivot cube around which to rotate
    const pivotIndex = Math.floor(this.cubes.length / 2);
    const pivot = this.cubes[pivotIndex].position;
    // Calculate new positions for each cube after rotation
    const newPositions = this.cubes.map((cube) => {
      const x = cube.position[0] - pivot[0];
      const z = cube.position[2] - pivot[2];
      // Rotate 90 degrees around the pivot on the Y axis
      return [pivot[0] - z, cube.position[1], pivot[2] + x];
    });
    // Apply new position if there is no collision
    const collisions = this.isColliding(newPositions);
    if (collisions) {
      if (collisions.includes("wall")) {
        const correctedPositions = this.correctToStageBounds(newPositions);
        const collisionsAfterCorrection = this.isColliding(correctedPositions);
        if (
          !collisionsAfterCorrection ||
          !collisionsAfterCorrection.includes("locked")
        ) {
          this.applyNewPosition(correctedPositions);
        }
      } else {
        return;
      }
    } else {
      this.applyNewPosition(newPositions);
    }
    this.updateStage();
  }

  clearFromStage() {
    this.cubes.forEach((cube) => {
      this.stage.resetCube(
        cube.position[0],
        cube.position[1],
        cube.position[2],
      );
    });
  }

  updateStage() {
    this.cubes.forEach((cube) => {
      this.stage.fillCube(
        cube.position[0],
        cube.position[1],
        cube.position[2],
        cube.id,
        cube.locked ? "locked" : "active",
      );
    });
  }

  correctToStageBounds(positions: any) {
    const corrected: any[] = [];
    let minX = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < positions.length; i++) {
      corrected[i] = [positions[i][0], positions[i][1], positions[i][2]];
      maxX = Math.max(maxX, positions[i][0]);
      maxZ = Math.max(maxZ, positions[i][2]);
      minX = Math.min(minX, positions[i][0]);
      minZ = Math.min(minZ, positions[i][2]);
    }
    if (maxX >= this.stage.width) {
      let offsetX = maxX - this.stage.width + 1;
      for (let i = 0; i < positions.length; i++) {
        corrected[i][0] = positions[i][0] - offsetX;
      }
    }
    if (maxZ >= this.stage.depth) {
      let offsetZ = maxZ - this.stage.depth + 1;
      for (let i = 0; i < positions.length; i++) {
        corrected[i][2] = positions[i][2] - offsetZ;
      }
    }
    if (minX < 0) {
      let offsetX = -minX;
      for (let i = 0; i < positions.length; i++) {
        corrected[i][0] = positions[i][0] + offsetX;
      }
    }
    if (minZ < 0) {
      let offsetZ = -minZ;
      for (let i = 0; i < positions.length; i++) {
        corrected[i][2] = positions[i][2] + offsetZ;
      }
    }
    return corrected;
  }

  create() {
    const shape = Brick.SHAPES[Math.floor(Math.random() * Brick.SHAPES.length)];
    const startPosition = [
      Math.floor(Math.random() * this.stage.width),
      this.stage.height - 1,
      Math.floor(Math.random() * this.stage.depth),
    ];
    for (let x = 0; x < shape.length; x++) {
      for (let z = 0; z < shape[x].length; z++) {
        if (shape[x][z] === 1) {
          const cube = {
            position: [
              startPosition[0] + x,
              startPosition[1],
              startPosition[2] + z,
            ],
            id: this.stage.getNewID(),
            locked: false,
          };
          this.cubes.push(cube);
        }
      }
    }
    const correctedPositions = this.correctToStageBounds(
      this.getCubesPositions(),
    );
    this.applyNewPosition(correctedPositions);
    this.updateStage();
  }
}
