import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import cubeObj from "./cube.obj?url";
import { cubeMaterial, floorMaterial, shadowMaterial } from "./materials";
import { Stage, Cube } from "../stage";
import { Cube as Tetrino } from "./cube";
import { CFG } from "../config";
import { Floor } from "./floor";

let tempCounter = 0;

export class Engine {
  private stage: Stage;
  private boxes: (Tetrino | null)[];
  private shadowCubes: any;
  private idsInStage: number[];
  private cubeObj?: THREE.BufferGeometry;
  private renderer?: THREE.WebGLRenderer;
  private camera?: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private scene?: THREE.Scene;
  private floorCenterX: number;
  private floorCenterZ: number;
  private activeCamera: number;
  private cameraPositions: any;
  private floor: Floor | null;

  constructor(stage: Stage, onReady: (engine: Engine) => void) {
    this.stage = stage;
    this.boxes = [];
    this.shadowCubes = [];
    this.idsInStage = [];
    this.cubeObj = undefined;
    this.floorCenterX = 0;
    this.floorCenterZ = 0;
    this.activeCamera = 0;
    this.cameraPositions = [{}];
    this.floor = null;

    new OBJLoader().load(
      cubeObj,
      (obj: any) => {
        obj.traverse((child: any) => {
          if (child.isMesh) {
            this.cubeObj = child.geometry; // Extract the geometry from each mesh
          }
        });
        console.log(this.cubeObj);
        this.setup();
        onReady(this);
      },
      (xhr: any) => {
        console.log(xhr?.loaded);
      },
      (error: any) => {
        console.log("error", error);
      },
    );
  }

  setup() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff);
    document.body.appendChild(this.renderer.domElement);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.floorCenterX = this.stage.width / 2 - 0.5;
    this.floorCenterZ = this.stage.depth / 2 - 0.5;
    this.cameraPositions = [
      {
        x: this.floorCenterX,
        z: this.floorCenterZ + this.stage.depth / 2,
      },
      {
        x: this.floorCenterX - this.stage.width / 2,
        z: this.floorCenterZ,
      },
      {
        x: this.floorCenterX,
        z: this.floorCenterZ - this.stage.depth / 2,
      },
      {
        x: this.floorCenterX + this.stage.width / 2,
        z: this.floorCenterZ,
      },
    ];
    // this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    const frustumSize = 12;
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      1000,
    );
    // this.camera?.zoom = 10;
    this.camera.position.y = this.stage.width * 2;
    this.camera.position.x = this.floorCenterX + this.stage.width;
    this.camera.position.z = this.floorCenterZ + this.stage.depth;
    this.camera.zoom = 0.8;
    this.camera.updateProjectionMatrix();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(this.floorCenterX, 0, this.floorCenterZ);
    this.controls.update();
    this.scene = new THREE.Scene();
    this.floor = new Floor(this.stage.width, this.stage.depth, this.scene);
  }

  handleCube(cube: Cube, x: number, y: number, z: number) {
    if (!cube?.id || !this.scene) {
      return;
    }
    this.idsInStage.push(cube.id);
    if (this.boxes[cube.id]) {
      this.boxes[cube.id]?.setPosition(x, y, z);
      if (cube.state === "locked") {
        const l = CFG.cubes.locked.length;
        const v = CFG.cubes.locked[y % l];
        this.boxes[cube.id]?.setVariant(v);
      }
      if (cube.state === "active") {
        this.shadowCubes.push({ ...cube, x, y, z });
      }
      return;
    }
    this.boxes[cube.id] = new Tetrino(CFG.cubes.active, this.scene).setPosition(
      x,
      y,
      z,
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
          this.handleCube(cube, x, y, z);
        }
      }
    }
    this.boxes.forEach((box, id) => {
      if (box === null) {
        return;
      }
      if (!box.destroying && !this.idsInStage.includes(id)) {
        box.destroy();
      }
    });
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

  cameraRotate(dir: "right" | "left") {
    if (dir === "right") {
      this.activeCamera += 1;
      if (this.activeCamera >= this.cameraPositions.length) {
        this.activeCamera = 0;
      }
    }
    if (dir === "left") {
      this.activeCamera -= 1;
      if (this.activeCamera < 0) {
        this.activeCamera = this.cameraPositions.length - 1;
      }
    }
    this.camera.position.x = this.cameraPositions[this.activeCamera].x;
    this.camera.position.z = this.cameraPositions[this.activeCamera].z;
    this.camera.lookAt(
      new THREE.Vector3(this.floorCenterX, 0, this.floorCenterZ),
    );
    this.camera.updateProjectionMatrix();
  }

  render() {
    if (!this.camera || !this.renderer || !this.scene) {
      return;
    }
    tempCounter += 0.03;
    if (this.stage.dirty) {
      this.applyStage();
      this.renderShadows();
      this.stage.dirty = false;
    }
    this.camera.position.x += Math.sin(tempCounter) / 400;
    this.camera.position.z += Math.cos(tempCounter) / 400;
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);
  }
}
