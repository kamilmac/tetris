import * as THREE from "three";

export class Cube {
  mesh: THREE.Mesh;
  scene: THREE.Scene;
  positionInitiated: boolean = false;
  targetPosition: THREE.Vector3 | null = null;
  targetScale: THREE.Vector3 | null = null;
  requestId: number | null = null;
  destroying: boolean = false;

  constructor(color: number, scene: THREE.Scene) {
    this.scene = scene;
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial());
    this.mesh.scale.set(0.95, 0.95, 0.95);
    this.setColor(color);
    this.scene.add(this.mesh);
    requestAnimationFrame(this.animate);
  }

  setColor(color: number) {
    this.mesh.material.uniforms.u_colorA.value = new THREE.Color().setHex(
      color,
    );
  }

  setPosition(x: number, y: number, z: number) {
    if (!this.positionInitiated) {
      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.mesh.position.z = z;
      this.positionInitiated = true;
    } else {
      this.targetPosition = new THREE.Vector3(x, y, z);
    }
  }

  setScale(scale: number) {
    this.targetScale = new THREE.Vector3(scale, scale, scale);
  }

  destroy() {
    this.destroying = true;
    this.setScale(0);
  }

  animate = () => {
    if (this.targetPosition) {
      this.mesh.position.lerp(this.targetPosition, 0.25);
      if (this.mesh.position.distanceTo(this.targetPosition) < 0.001) {
        this.mesh.position.set(
          this.targetPosition.x,
          this.targetPosition.y,
          this.targetPosition.z,
        );
        this.targetPosition = null;
      }
    }
    if (this.targetScale) {
      this.mesh.scale.lerp(this.targetScale, 0.25);
      if (this.mesh.scale.distanceTo(this.targetScale) < 0.001) {
        this.mesh.scale.set(
          this.targetScale.x,
          this.targetScale.y,
          this.targetScale.z,
        );
        this.targetScale = null;
      }
    }
    if (this.destroying && !this.targetScale && !this.targetPosition) {
      this.scene.remove(this.mesh);
      this.mesh = null;
    }
    requestAnimationFrame(this.animate);
  };
}

const cubeMaterial = () =>
  new THREE.ShaderMaterial({
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
        value: 0.05,
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
