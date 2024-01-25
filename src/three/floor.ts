import * as THREE from "three";
import { Scene } from "three";
import { CFG } from "../config";
import { Stage } from "../stage";

export class Floor {
  geometry: THREE.BoxGeometry;
  material: THREE.ShaderMaterial;
  constructor(width: number, depth: number, scene: Scene) {
    const height = 0.1;
    this.geometry = new THREE.PlaneGeometry(width, depth);
    this.material = floorMaterial();
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.x = width / 2 - 0.5;
    mesh.position.y = -height - 0.5;
    mesh.position.z = depth / 2 - 0.5;
    mesh.rotation.x = -Math.PI / 2;
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
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float gridSpacing;
      uniform float lineWidth;
      uniform vec3 color;
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        float grid = 6.0;
        float thickness = 0.04;
    
        float t = 1.0 - thickness;
        float bx = (1.0 - t) / grid;
    
        // float xx = 1.0 - vUv.x;
        // xx = smoothstep(1.0 - bx, 1.0 - bx, xx);

        // float yy = 1.0 - vUv.y;
        // float by = (1.0 - t) / grid;
        // yy = smoothstep(1.0 - by, 1.0 - by, yy);

        // float xxx = vUv.x;
        // xxx = smoothstep(1.0 - bx, 1.0 - bx, xxx);

        // float yyy = vUv.y;
        // yyy = smoothstep(1.0 - by, 1.0 - by, yyy);

        float x = vUv.x - bx;
        x = fract(x * grid);
        x = smoothstep(t, t, x);
    
        float y = vUv.y - bx;
        y = fract(y * grid);
        y = smoothstep(t, t, y);
        if (x + y < 0.01) {
          discard;
        }    
        gl_FragColor = vec4(x + y, 0, 0, 1);
      }
    `,
    transparent: true,
  });
