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

const floorMaterial = new THREE.ShaderMaterial({
  uniforms: {
    gridSpacing: { value: 1.0 },
    lineWidth: { value: 0.05 },
  },
  vertexShader: `
    varying vec3 vPosition;

    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float gridSpacing;
    uniform float lineWidth;
    varying vec3 vPosition;

    void main() {
      // Calculate the fraction part of the current position divided by gridSpacing
      vec3 grid = abs(fract(vPosition.xyz / gridSpacing - 0.5) - 0.5) / lineWidth;
      // Determine the minimum distance to the closest edge in X and Z
      float minDist = min(grid.x, grid.z);
      // Draw grid lines by checking if we are close to an edge
      float edgeFactor = min(minDist, 1.0);

      if(edgeFactor == 1.0) {
        discard; // Discard grid lines fragment
      }

      gl_FragColor = vec4(edgeFactor); // White for grid lines, black elsewhere
    }
  `,
  transparent: true,
});

const cubeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_time: {
      value: 1.0,
    },
    u_colorA: {
      value: new THREE.Color("rgb(224,222,216)"),
    },
    u_colorB: {
      value: new THREE.Color("rgb(58,58,58)"),
    },
    u_thickness: {
      value: 0.001,
    },
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

let tempCounter = 0;

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

  handleCube(cube, x, y, z) {
    if (!cube?.id) {
      return;
    }
    this.idsInStage.push(cube.id);
    if (this.boxes[cube.id]) {
      if (y % 2) {
        this.boxes[cube.id].material.uniforms.u_colorA.value = new THREE.Color("rgb(174,202,186)");
      } else {
        this.boxes[cube.id].material.uniforms.u_colorA.value = new THREE.Color("rgb(224,222,216)");
      }
      this.boxes[cube.id]._targetPosition = new THREE.Vector3(x, y, z);
      // this.boxes[cube.id].material.color.setHex(cube.color);
      this.boxes[cube.id]._lerpDone = false;
      return;
    }
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const geometry = this.cubeObj;
    // const material = new THREE.MeshBasicMaterial({ color: cube.color });
    const mesh = new THREE.Mesh(geometry, cubeMaterial.clone());
    const col = getRandomHSLColor();
    // mesh.material.uniforms.u_colorA.value = new THREE.Color().setHSL(col[0], col[1], col[2]);
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
    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, floorMaterial);
    mesh.position.x = this.stage.width / 2 - 0.5;
    mesh.position.y = -floorThickness - 0.5;
    mesh.position.z = this.stage.depth / 2 - 0.5;
    this.scene.add(mesh);
  }

  lerpTargets() {
    this.boxes.forEach((box, i) => {
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
    tempCounter += 0.03;
    cubeMaterial.uniforms.u_thickness.value =
      Math.sin(tempCounter) * 0.01 + 0.05;
    if (this.stage.dirty) {
      this.applyStage();
      this.stage.dirty = false;
    }
    this.lerpTargets();
    this.renderer.render(this.scene, this.camera);
  }
}

const getRandomHSLColor = () => {
  const hue = Math.random();
  // const saturation = Math.floor(Math.random() * 101); // Percentage value between 0 and 100
  // const lightness = Math.floor(Math.random() * 101); // Percentage value between 0 and 100
  // return `hsl(${hue}, ${s}%, ${l}%)`;
  console.log({hue})
  return [hue, 0.7, 0.6];
};
