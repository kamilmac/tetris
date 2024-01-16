import * as THREE from "three";
import { Scene } from "three";
import { CFG } from "../config";
import { Stage } from "../stage";

export class Floor {
  geometry: THREE.BoxGeometry;
  material: THREE.ShaderMaterial;
  constructor(width: number, depth: number, scene: Scene) {
    const height = 0.1;
    this.geometry = new THREE.BoxGeometry(width, height, depth);
    this.material = floorMaterial();
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.x = width / 2 - 0.5;
    mesh.position.y = -height - 0.5;
    mesh.position.z = depth / 2 - 0.5;
    scene?.add(mesh);
  }
}

export const floorMaterial = () =>
  new THREE.ShaderMaterial({
    uniforms: {
      gridSpacing: { value: 1.0 },
      lineWidth: { value: 0.05 },
      color: { value: new THREE.Color().setHex(CFG.colors.floor) },
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
      uniform vec3 color;
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

        gl_FragColor = vec4(color, edgeFactor); // White for grid lines, black elsewhere
      }
    `,
    transparent: true,
  });
