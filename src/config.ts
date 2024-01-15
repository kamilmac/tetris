import * as THREE from "three";
const FLOOR_SIZE = 6;

export interface CubeType {
  faceColors: {
    topBottom: THREE.Color;
    frontBack: THREE.Color;
    leftRight: THREE.Color;
  };
  border?: {
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
    return new THREE.Color().setHSL(h / 360, s / 100, l / 100);
  }
  if (typeof color === "number") {
    return new THREE.Color().setHex(color);
  }
  return new THREE.Color();
};

export const cubeVariants: Record<string, CubeType> = {
  dante: {
    faceColors: {
      topBottom: c("hsl(120, 40%, 25%)"),
      frontBack: c("hsl(120, 60%, 15%)"),
      leftRight: c("hsl(120, 40%, 40%)"),
    },
    border: {
      thickness: 3,
      color: c(0x222222),
    },
    scale: 1,
    pattern: "A",
  },
  reda: {
    faceColors: {
      topBottom: c("hsl(180, 40%, 25%)"),
      frontBack: c("hsl(180, 60%, 15%)"),
      leftRight: c("hsl(180, 40%, 40%)"),
    },
    border: {
      thickness: 3,
      color: c(0x222222),
    },
    scale: 1,
    pattern: "A",
  },
  polmot: {
    faceColors: {
      topBottom: c("hsl(249, 40%, 25%)"),
      frontBack: c("hsl(249, 60%, 15%)"),
      leftRight: c("hsl(249, 40%, 40%)"),
    },
    border: {
      thickness: 3,
      color: c(0x222222),
    },
    scale: 1,
    pattern: "A",
  },
  trolja: {
    faceColors: {
      topBottom: c("hsl(30, 40%, 25%)"),
      frontBack: c("hsl(30, 60%, 15%)"),
      leftRight: c("hsl(30, 40%, 40%)"),
    },
    border: {
      thickness: 3,
      color: c(0x222222),
    },
    scale: 1,
    pattern: "A",
  },
};

export const CFG = {
  background: {
    color: 0xefefef,
  },
  cubes: {
    active: "dante",
    locked: ["polmot", "reda", "trolja"],
  },
  colors: {
    activeCube: 0xefefef,
    lockedRows: [0xff0000, 0x00ff00, 0x0000ff],
    floor: 0xcc8822,
  },
  cycleTime: 300,
  shapes: [],
  stage: {
    width: FLOOR_SIZE,
    depth: FLOOR_SIZE,
    height: 8,
  },
  controls: {
    cameraRotateRight: "d",
    cameraRotateLeft: "s",
    moveBlockLeft: "ArrowLeft",
    moveBlockRight: "ArrowRight",
    moveBlockDown: "ArrowDown",
    moveBlockRotate: "ArrowUp",
  },
};
