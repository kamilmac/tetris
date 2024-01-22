import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import cubeObj from "./cube.obj?url";
import { shadowMaterial } from "./materials";
import { Stage, Cube } from "../stage";
import { Cube as Tetrino } from "./cube";
import { CFG } from "../config";
import { Floor } from "./floor";
import { Camera } from "./camera";
import { Physics } from "../physics";
import { Walls } from "./walls";

export class Engine {
  private stage: Stage;
  private shadowCubes: any;
  private idsInStage: number[];
  private cubeObj?: THREE.BufferGeometry;
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private floor: Floor | null;
  private physics: Physics;
  boxes: (Tetrino | null)[];
  camera?: THREE.PerspectiveCamera;
  usePhysics: boolean;

  constructor(stage: Stage, onReady: (engine: Engine) => void) {
    this.stage = stage;
    this.boxes = new Map();
    this.shadowCubes = [];
    this.idsInStage = [];
    this.cubeObj = undefined;
    this.floorCenterX = 0;
    this.floorCenterZ = 0;
    this.floor = null;
    this.camera = null;
    this.physics = null;
    this.usePhysics = false;
    this.setup();
    onReady(this);
    // new OBJLoader().load(
    //   cubeObj,
    //   (obj: any) => {
    //     obj.traverse((child: any) => {
    //       if (child.isMesh) {
    //         this.cubeObj = child.geometry; // Extract the geometry from each mesh
    //       }
    //     });
    //     console.log(this.cubeObj);
    //     this.setup();
    //     onReady(this);
    //   },
    //   (xhr: any) => {
    //     console.log(xhr?.loaded);
    //   },
    //   (error: any) => {
    //     console.log("error", error);
    //   },
    // );
  }

  setup() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(CFG.background.color);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new Camera(this.stage, this.renderer);
    this.floor = new Floor(this.stage.width, this.stage.depth, this.scene);
    this.walls = new Walls(this.scene, this.camera);
    this.physics = new Physics();
  }

  handleCube(cube: Cube, x: number, y: number, z: number) {
    if (!cube?.id || !this.scene) {
      return;
    }
    if (this.boxes.has(cube.id)) {
      const box = this.boxes.get(cube.id);
      box?.setPosition(x, y, z);
      if (cube.state === "locked") {
        const l = CFG.cubes.locked.length;
        const v = CFG.cubes.locked[y % l];
        box.setVariant(v);
      }
      if (cube.state === "active") {
        this.shadowCubes.push({ ...cube, x, y, z });
      }
      return;
    }
    this.boxes.set(
      cube.id,
      new Tetrino(CFG.cubes.active, this.scene).setPosition(x, y, z),
    );
  }

  applyStage() {
    if (!this.scene) {
      return;
    }
    this.idsInStage = [];
    for (let x = 0; x < this.stage.width; x++) {
      for (let y = 0; y < this.stage.height; y++) {
        for (let z = 0; z < this.stage.depth; z++) {
          const cube: Cube = this.stage.cubes[x][y][z];
          if (cube?.id) {
            this.idsInStage.push(cube.id);
          }
          this.handleCube(cube, x, y, z);
        }
      }
    }
    for (let [id, box] of this.boxes) {
      if (box === null) {
        return;
      }
      if (!box.destroying && !this.idsInStage.includes(id)) {
        box.destroy();
      }
      if (box.mesh === null) {
        this.boxes.delete(id);
      }
    }
  }

  renderShadows() {
    this.scene.remove(this.shadowGroup);
    this.shadowGroup = new THREE.Group();
    let highestLockedYUnder = -1;
    let lowestShadowCubeY = 1000;
    this.shadowCubes.forEach((sc) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometry, shadowMaterial);
      mesh.scale.set(0.95, 0.95, 0.95);
      if (sc.y < lowestShadowCubeY) {
        lowestShadowCubeY = sc.y;
      }
      for (let yy = sc.y - 1; yy >= 0; yy -= 1) {
        if (this.stage.isCubeDefined(sc.x, yy, sc.z)) {
          if (this.stage.cubes[sc.x][yy][sc.z]?.state === "locked") {
            if (yy > highestLockedYUnder) {
              highestLockedYUnder = yy;
            }
          }
        }
      }
      mesh.position.x = sc.x;
      mesh.position.y = sc.y;
      mesh.position.z = sc.z;
      this.shadowGroup.add(mesh);
    });
    this.shadowGroup.position.y = highestLockedYUnder - lowestShadowCubeY + 1;
    if (
      highestLockedYUnder - lowestShadowCubeY + 1 !== 0 &&
      highestLockedYUnder - lowestShadowCubeY + 1 !== 1000
    ) {
      this.scene.add(this.shadowGroup);
    }
    this.shadowCubes = [];
  }

  captureSceneWithPhysics() {
    if (this.usePhysics) {
      return;
    }
    this.physics.attach(this.boxes);
    this.usePhysics = true;
  }

  animate() {
    if (!this.camera || !this.renderer || !this.scene) {
      return;
    }
    if (!this.usePhysics) {
      this.walls.animate();
      if (this.stage.dirty) {
        this.applyStage();
        this.renderShadows();
        this.stage.dirty = false;
      }
      for (let [_, box] of this.boxes) {
        box?.animate();
      }
    } else {
      this.physics.animate();
    }
    this.renderer.render(this.scene, this.camera.animate());
  }
}
