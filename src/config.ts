const FLOOR_SIZE = 6;

export const CFG = {
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
