import * as THREE from "three";
import { cubeVariants, CubeType } from "../config";

export class Cube {
  mesh: THREE.Mesh;
  scene: THREE.Scene;
  positionInitiated: boolean = false;
  targetPosition: THREE.Vector3 | null = null;
  targetScale: THREE.Vector3 | null = null;
  requestId: number | null = null;
  destroying: boolean = false;
  variant: CubeType;

  constructor(variant: string, scene: THREE.Scene) {
    this.scene = scene;
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial());
    this.variant = cubeVariants[variant];
    this.setColor();
    this.setThickness();
    this.scene.add(this.mesh);
    requestAnimationFrame(this.animate);
  }

  setColor() {
    this.mesh.material.uniforms.u_color_top_bottom.value =
      this.variant.faceColors.topBottom;
    this.mesh.material.uniforms.u_color_left_right.value =
      this.variant.faceColors.leftRight;
    this.mesh.material.uniforms.u_color_front_back.value =
      this.variant.faceColors.frontBack;
  }

  setThickness() {
    if (!this.variant.edge?.thickness) {
      return;
    }
    this.mesh.material.uniforms.u_thickness = this.variant.edge.thickness;
  }

  setVariant(newVariant: string) {
    this.variant = cubeVariants[newVariant];
    this.setColor();
    this.setThickness();
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
      this.mesh.position.lerp(this.targetPosition, 0.22);
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
      this.mesh.scale.lerp(this.targetScale, 0.12);
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
      u_color_left_right: {
        value: new THREE.Color("rgb(224,222,216)"),
      },
      u_color_front_back: {
        value: new THREE.Color("rgb(224,222,216)"),
      },
      u_color_top_bottom: {
        value: new THREE.Color("rgb(224,222,216)"),
      },
      u_thickness: {
        value: 0.02,
      },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float u_thickness;
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform vec3 u_color_top_bottom;
      uniform vec3 u_color_left_right;
      uniform vec3 u_color_front_back;

      void main() {
          float thickness = u_thickness;
          vec3 color;
          vec3 absNor = abs(vNormal);
          if (vNormal.x > 0.9) color = u_color_left_right;
          else if (vNormal.x < -0.9) color = u_color_left_right;
          else if (vNormal.y > 0.9) color = u_color_top_bottom;
          else if (vNormal.y < -0.9) color = u_color_top_bottom;
          else if (vNormal.z > 0.9) color = u_color_front_back;
          else if (vNormal.z < -0.9) color = u_color_front_back;
          else color = vec3(1.0, 1.0, 1.0); // Shouldn't happen; set to White

          if (vUv.y < thickness || vUv.y > 1.0 - thickness || vUv.x < thickness || vUv.x > 1.0 - thickness) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          } else {
            gl_FragColor = LinearTosRGB(vec4(color, 1.0));
          }
      }
    `,
    transparent: true,
  });
