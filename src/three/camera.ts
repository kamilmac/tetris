import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Stage } from "../stage";
import * as THREE from "three";

export class Camera {
  camera: THREE.OrthographicCamera;
  stage: Stage;
  floorCenterX: number = 0;
  floorCenterZ: number = 0;
  cameraPositions: any = [];
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  targetPosition: THREE.Vector3 | null = null;

  constructor(stage: Stage, renderer: THREE.WebGLRenderer) {
    this.activeCamera = 0;
    this.stage = stage;
    this.renderer = renderer;
    this.floorCenterZ = this.stage.depth / 2 - 0.5;
    this.floorCenterX = this.stage.width / 2 - 0.5;
    this.cameraPositions = [
      {
        x: this.floorCenterX + this.stage.width -5,
        z: this.floorCenterZ + this.stage.depth,
      },
      {
        x: this.floorCenterX + this.stage.width,
        z: this.floorCenterZ - this.stage.depth + 5,
      },
      {
        x: this.floorCenterX - this.stage.width + 5,
        z: this.floorCenterZ - this.stage.depth,
      },
      {
        x: this.floorCenterX - this.stage.width,
        z: this.floorCenterZ + this.stage.depth -5,
      },
    ];
    // const frustumSize = 12; 
    // const aspect = window.innerWidth / window.innerHeight;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(120, width / height, 0.1, 1000);
    // this.camera = new THREE.OrthographicCamera(
    //   (frustumSize * aspect) / -2,
    //   (frustumSize * aspect) / 2,
    //   frustumSize / 2,
    //   frustumSize / -2,
    //   1,
    //   1000,
    // );
    this.camera.zoom = 3.10;
    this.setPosition(
      this.floorCenterX + this.stage.width,
      this.stage.width * 2,
      this.floorCenterZ + this.stage.depth,
    );
    
    this.camera.updateProjectionMatrix();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(this.floorCenterX, 0, this.floorCenterZ);
    this.controls.update();
    return this;
  }

  setPosition(x: number, y: number, z: number) {
    if (!this.targetPosition) {
      this.camera.position.x = x;
      this.camera.position.y = y;
      this.camera.position.z = z;
    }
    this.targetPosition = new THREE.Vector3(x, y, z);
  }

  lerp() {
    if (this.targetPosition) {
      this.camera.position.lerp(this.targetPosition, 0.08);
      if (this.camera.position.distanceTo(this.targetPosition) < 0.001) {
        this.camera.position.set(
          this.targetPosition.x,
          this.targetPosition.y,
          this.targetPosition.z,
        );
        this.cameraInMotion = false;
      }
    }
  }

  rotate = (dir: "right" | "left") => {
    this.cameraInMotion = true;
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
    this.setPosition(
      this.cameraPositions[this.activeCamera].x,
      this.camera.position.y,
      this.cameraPositions[this.activeCamera].z,
    )
  }
  
  animate() {
    this.lerp();
    this.camera.lookAt(
      new THREE.Vector3(this.floorCenterX, 0, this.floorCenterZ),
    );
    this.camera.updateProjectionMatrix();
    return this.camera;
  }
}