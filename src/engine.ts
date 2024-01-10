import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import cubeObj from "./cube.obj?url";
import { CFG } from "./config";
import { cubeMaterial, floorMaterial } from "./materials";
import { Stage, Cube } from "./stage";

let tempCounter = 0;

export class Engine {
  private stage: Stage;
  private boxes: (THREE.Mesh | null)[];
  private idsInStage: number[];
  private cubeObj?: THREE.BufferGeometry;
  private renderer?: THREE.WebGLRenderer;
  private camera?: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private scene?: THREE.Scene;

  constructor(stage: Stage, onReady: () => void) {
    this.stage = stage;
    this.boxes = [];
    this.idsInStage = [];
    this.cubeObj = undefined;

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
        onReady();
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
    document.body.appendChild(this.renderer.domElement);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const floorCenterX = this.stage.width / 2 - 0.5;
    const floorCenterZ = this.stage.depth / 2 - 0.5;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.x = floorCenterX;
    this.camera.position.y = 12;
    this.camera.position.z = floorCenterZ + this.stage.depth / 2;
    this.camera.updateProjectionMatrix();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(floorCenterX, 0, floorCenterZ);
    this.controls.update();
    this.scene = new THREE.Scene();
    this.renderFloor();
  }

  handleCube(cube: Cube, x: number, y: number, z: number) {
    if (!cube?.id || !this.scene) {
      return;
    }
    this.idsInStage.push(cube.id);
    if (this.boxes[cube.id]) {
      this.boxes[cube.id].material.uniforms.u_colorA.value =
        new THREE.Color().setHex(cube.color);
      this.boxes[cube.id]._targetPosition = new THREE.Vector3(x, y, z);
      this.boxes[cube.id]._lerpDone = false;
      return;
    }
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const mesh = new THREE.Mesh(geometry, cubeMaterial.clone());
    mesh.material.uniforms.u_colorA.value = new THREE.Color().setHex(
      cube.color,
    );
    mesh.scale.set(0.95, 0.95, 0.95);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    this.scene.add(mesh);
    this.boxes[cube.id] = mesh;
  }

  renderFloor() {
    const floorThickness = 0.1;
    const geometry = new THREE.BoxGeometry(
      this.stage.width,
      floorThickness,
      this.stage.depth,
    );
    const mesh = new THREE.Mesh(geometry, floorMaterial);
    mesh.position.x = this.stage.width / 2 - 0.5;
    mesh.position.y = -floorThickness - 0.5;
    mesh.position.z = this.stage.depth / 2 - 0.5;
    this.scene?.add(mesh);
  }

  lerpTargets() {
    this.boxes.forEach((box, _) => {
      if (box === null) {
        return;
      }
      if (box._targetPosition && !box._lerpDone) {
        box.position.lerp(box._targetPosition, 0.25);
        if (box.position.distanceTo(box._targetPosition) < 0.001) {
          box._lerpDone = true;
        }
      }
    });
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
    this.boxes.forEach((box, i) => {
      if (box === null) {
        return;
      }
      if (!this.idsInStage.includes(i)) {
        this.scene?.remove(box);
        this.boxes[i] = null;
      }
    });
  }

  render() {
    if (!this.camera || !this.renderer || !this.scene) {
      return;
    }
    tempCounter += 0.03;
    cubeMaterial.uniforms.u_thickness.value =
      Math.sin(tempCounter) * 0.01 + 0.05;
    if (this.stage.dirty) {
      this.applyStage();
      this.stage.dirty = false;
    }
    this.camera.position.x += Math.sin(tempCounter) / 400;
    this.camera.position.z += Math.cos(tempCounter) / 400;
    this.camera.updateProjectionMatrix();
    this.lerpTargets();
    this.renderer.render(this.scene, this.camera);
  }
}
