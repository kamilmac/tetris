import * as THREE from "three";

export class BG {
  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    const geometry = new THREE.PlaneGeometry(1, 1); // Initial size, will be updated
    const plane = new THREE.Mesh(geometry, material);
    this.plane = plane;
    scene.add(plane);
  }
  animate() {
    // Position the plane in front of the camera
    const distance = 30; // Set your desired distance
    this.plane.position.copy(this.camera.position);
    this.plane.rotation.copy(this.camera.rotation);
    this.plane.translateZ(-distance);

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
  fragmentShader: `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // red color
    }
    `,
});
