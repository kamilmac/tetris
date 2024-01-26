import * as THREE from "three";
import { CFG } from "../config";
import { Camera } from "./camera";
import { floorMaterial } from "./floor";

export class Walls {
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene, camera: Camera) {
    this.scene = scene;
    let geometry = new THREE.BoxGeometry(
      CFG.stage.width,
      CFG.stage.limit,
      0.01,
    );
    let material = floorMaterial.clone();
    let mesh = new THREE.Mesh(geometry, material);
    mesh.material.uniforms.gridH.value = CFG.stage.limit;
    mesh.material.uniforms.gridW.value = CFG.stage.width;
    mesh.position.x = 2.5;
    mesh.position.y = 1.5;
    mesh.position.z = -0.5;
    scene?.add(mesh);

    geometry = new THREE.BoxGeometry(CFG.stage.width, CFG.stage.limit, 0.01);
    material = floorMaterial.clone();
    mesh = new THREE.Mesh(geometry, material);
    console.log(CFG.stage.limit);
    mesh.material.uniforms.gridH.value = CFG.stage.limit;
    mesh.material.uniforms.gridW.value = CFG.stage.width;
    mesh.rotation.y = Math.PI * 0.5;
    mesh.position.x = -0.5;
    mesh.position.y = 1.5;
    mesh.position.z = 2.5;
    this.mesh = mesh;
    scene?.add(mesh);
  }

  animate() {
    // this.mesh.material.uniforms.gridH.value = CFG.stage.limit;
    // this.mesh.material.uniforms.gridW.value = CFG.stage.width;
  }
}

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      float linePos = step(0.01, abs(vUv.x - uTime));
      gl_FragColor = vec4(1.0, 0.0, 0.0, 0.05);
      // gl_FragColor = vec4(vec3(linePos), 1.0 - linePos);
    }
  `,
  transparent: true,
  side: THREE.BackSide,
  depthTest: false,
});
