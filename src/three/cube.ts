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
    this.mesh.scale.set(0.85, 0.85, 0.85);
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
    return this;
  }

  setScale(scale: number) {
    this.targetScale = new THREE.Vector3(scale, scale, scale);
    return this;
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
      return;
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
    varying vec3 vNormal;
    varying float y;
    uniform float u_thickness;

    void main() {
      vUv = uv;
      vNormal = normal;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      projectedPosition.y = u_thickness + projectedPosition.y;
      y = projectedPosition.y;
      gl_Position = projectedPosition;
    }
  `,
    fragmentShader: `
    varying vec3 vNormal;

void main() {
    vec3 color;
    vec3 absNor = abs(vNormal);
    if (vNormal.x > 0.9) color = vec3(1.0, 0.0, 0.0); // Right: Red
    else if (vNormal.x < -0.9) color = vec3(0.0, 1.0, 0.0); // Left: Green
    else if (vNormal.y > 0.9) color = vec3(0.0, 0.0, 1.0); // Top: Blue
    else if (vNormal.y < -0.9) color = vec3(1.0, 1.0, 0.0); // Bottom: Yellow
    else if (vNormal.z > 0.9) color = vec3(1.0, 0.0, 1.0); // Front: Magenta
    else if (vNormal.z < -0.9) color = vec3(0.0, 1.0, 1.0); // Back: Cyan
    else color = vec3(1.0, 1.0, 1.0); // Shouldn't happen; set to White
    gl_FragColor = vec4(color, 1.0);
}
        `,
    transparent: true,
  });
