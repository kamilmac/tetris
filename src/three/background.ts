import * as THREE from "three";
import dashPatternImage from "./dash_pattern.png";
import kneePatternImage from "./knee_pattern.png";

const loader = new THREE.TextureLoader();
const texture = loader.load(dashPatternImage);

export class BG {
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    const geometry = new THREE.PlaneGeometry(1, 1); // Initial size, will be updated
    const plane = new THREE.Mesh(geometry, material);
    this.plane = plane;
    scene.add(plane);
    this.rotation = 0;
  }
  animate() {
    // Position the plane in front of the camera
    const distance = 30; // Set your desired distance
    this.plane.position.copy(this.camera.position);
    this.plane.rotation.copy(this.camera.rotation);
    this.plane.translateZ(-distance);
    this.rotation += 0.01;
    this.plane.material.uniforms.u_rotation.value = this.rotation;
    // Optionally, adjust the size of the plane based on the distance and camera FOV
    // to ensure it always fills the viewport
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov); // convert vertical fov to radians
    const height = 2 * Math.tan(vFOV / 2) * distance;
    const aspect = window.innerWidth / window.innerHeight;
    const width = height * aspect;
    this.plane.scale.set(width, height, 1);
  }
}

const material = new THREE.ShaderMaterial({
  uniforms: {
    u_texture: { value: texture },
    u_mosaicSize: { value: 64.0 },
    u_rotation: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D u_texture;
    uniform float u_mosaicSize;
    uniform float u_rotation;
    varying vec2 vUv;

    void main() {
      vec2 mosaicRegion = vec2(0.1, 0.1);

      // Calculate the rotation matrix
      float cosRot = cos(u_rotation);
      float sinRot = sin(u_rotation);
      mat2 rotMat = mat2(cosRot, -sinRot, sinRot, cosRot);
    
      vec2 mozaicCords = mod(vUv, mosaicRegion);

      mozaicCords = rotMat * (mozaicCords - 0.1) + 0.1;

      vec4 tex = texture2D(u_texture, mozaicCords);
      gl_FragColor = tex;
    }
  `,
  transparent: true,
});
