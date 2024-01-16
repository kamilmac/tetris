import * as THREE from "three";
// import { CFG } from "../config";

export const shadowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_time: {
      value: 1.0,
    },
    u_colorA: {
      value: new THREE.Color("rgb(250,250,000)"),
    },
    u_colorB: {
      value: new THREE.Color("rgb(58,58,58)"),
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
    varying vec2 vUv;
    varying float y;
    uniform float u_time;
    uniform float u_thickness;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;

    void main() {
      float thickness = u_thickness;
      if (vUv.y < thickness || vUv.y > 1.0 - thickness || vUv.x < thickness || vUv.x > 1.0 - thickness) {
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
      } else {
        gl_FragColor = LinearTosRGB(vec4(0.1, 0.1, 0.1, 0.0));
      }
    }
  `,
  transparent: true,
});
