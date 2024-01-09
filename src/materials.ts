import * as THREE from "three";

export const floorMaterial = new THREE.ShaderMaterial({
  uniforms: {
    gridSpacing: { value: 1.0 },
    lineWidth: { value: 0.05 },
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

      gl_FragColor = vec4(edgeFactor); // White for grid lines, black elsewhere
    }
  `,
  transparent: true,
});

export const cubeMaterial = new THREE.ShaderMaterial({
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
      value: 0.001,
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

