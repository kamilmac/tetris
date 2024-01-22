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
    u_mosaicSize: { value: 100.0 },
    u_rotation: { value: 0.3 },
    u_scale: { value: 1.8 },
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
    uniform float u_scale;
    varying vec2 vUv;

    void main() {
      // Calculate size of the mosaic tile in UV space
      vec2 mosaicSize = vec2(1.0 / u_mosaicSize);

      // Apply rotation
      float cosRot = cos(u_rotation);
      float sinRot = sin(u_rotation);
      mat2 rotMat = mat2(cosRot, -sinRot, sinRot, cosRot);

      // Scale and rotate coordinates
      vec2 uv = vUv * u_scale;
      vec2 rotatedUv = rotMat * (uv - 0.5) + 0.5;

      // Snap coordinates to the nearest tile by flooring
      vec2 snappedUv = floor(rotatedUv / mosaicSize) * mosaicSize;

      // Find the center of each tile
      vec2 centerUv = snappedUv + mosaicSize * 0.5;

      // Sample the texture at the center point of each tile
      vec4 texColor = texture2D(u_texture, centerUv);

      // Set the fragment color
      gl_FragColor = texColor;
    }
  `,
  transparent: true,
});
