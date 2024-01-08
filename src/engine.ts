import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import cubeObj from "./cube.obj?url";
// import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
// import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// import { HBAOPass } from 'three/addons/postprocessing/HBAOPass.js';

// import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// import Lifeforms from "lifeforms";

const cubeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_time: {
      value: 1.0
    },
    u_colorA: {
      value: new THREE.Color('rgb(224,222,216)')
    },
    u_colorB: {
      value: new THREE.Color('rgb(58,58,58)')
    },
    u_thickness: {
      value: 0.015
    }
  },
  vertexShader: `
    varying vec2 vUv;
    varying float y;
    uniform float u_thickness;

    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      projectedPosition.y = u_thickness + projectedPosition.y;
      y = projectedPosition.y;
      gl_Position = projectedPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float y;
    uniform float u_time;
    uniform float u_thickness;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;

    void main() {
      float thickness = u_thickness;
      if (vUv.y < thickness || vUv.y > 1.0 - thickness || vUv.x < thickness || vUv.x > 1.0 - thickness) {
        gl_FragColor = vec4(u_colorB, 1.0);
      } else {
        gl_FragColor = LinearTosRGB(vec4(u_colorA, 1.0));
      }
    }
  `,
  transparent: true,
});

export class Engine {
  constructor(stage, onReady) {
    this.stage = stage;
    this.boxes = [];
    this.idsInStage = [];
    this.cubeObj = null;
    new OBJLoader().load(
      cubeObj,
      (obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            this.cubeObj = child.geometry; // Extract the geometry from each mesh
          }
        });
        console.log(this.cubeObj);
        this.setup();
        onReady();
      },
      (xhr) => {
        console.log(xhr?.loaded);
      },
      (error) => {
        console.log("error", error);
      },
    );
  }

  setup() {
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.x = 12;
    this.camera.position.y = 6;
    this.camera.position.z = 12;
    this.camera.updateProjectionMatrix();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(
      this.stage.width / 2 - 0.5,
      0,
      this.stage.depth / 2 - 0.5,
    );
    this.controls.update();
    this.scene = new THREE.Scene();
    // this.scene.add(this.cubeObj);
    this.renderFloor();
  }

  handleCube(cube, x, y, z) {
    if (!cube?.id) {
      return;
    }
    this.idsInStage.push(cube.id);
    if (this.boxes[cube.id]) {
      this.boxes[cube.id]._targetPosition = new THREE.Vector3(x, y, z);
      // this.boxes[cube.id].material.color.setHex(cube.color);
      this.boxes[cube.id]._lerpDone = false;
      return;
    }
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    const geometry = this.cubeObj;
    // const material = new THREE.MeshBasicMaterial({ color: cube.color });
    const mesh = new THREE.Mesh(geometry, cubeMaterial);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = z;
    this.scene.add(mesh);
    this.boxes[cube.id] = mesh;
  }

  renderFloor() {
    const geometry = new THREE.BoxGeometry(
      this.stage.width,
      1,
      this.stage.depth,
    );
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = this.stage.width / 2 - 0.5;
    mesh.position.y = -1;
    mesh.position.z = this.stage.depth / 2 - 0.5;
    this.scene.add(mesh);
  }

  lerpTargets() {
    this.boxes.forEach((box, i) => {
      if (box === null) {
        return;
      }
      if (box._targetPosition && !box._lerpDone) {
        box.position.lerp(box._targetPosition, 0.2);
        if (box.position.distanceTo(box._targetPosition) < 0.001) {
          box._lerpDone = true;
        }
      }
    });
  }

  applyStage() {
    this.idsInStage = [];
    for (let x = 0; x < this.stage.width; x++) {
      for (let y = 0; y < this.stage.height; y++) {
        for (let z = 0; z < this.stage.depth; z++) {
          const cube = this.stage.cubes[x][y][z];
          this.handleCube(cube, x, y, z);
        }
      }
    }
    this.boxes.forEach((box, i) => {
      if (box === null) {
        return;
      }
      if (!this.idsInStage.includes(i)) {
        this.scene.remove(box);
        this.boxes[i] = null;
      }
    });
    window.boxes = this.boxes;
  }

  render() {
    if (this.stage.dirty) {
      this.applyStage();
      this.stage.dirty = false;
    }
    this.lerpTargets();
    this.renderer.render(this.scene, this.camera);
  }
}
