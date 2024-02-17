import * as THREE from "three";
import { CubeType, TPane, cubeVariants } from "../config";
// @ts-ignore
import pattern2 from "../patterns/Abstract Dotted Background.jpg";
// @ts-ignore
import pattern3 from "../patterns/Abstract Point Noise Background.jpg";
// @ts-ignore
import pattern4 from "../patterns/Barcode Product Label.jpg";
// @ts-ignore
import pattern6 from "../patterns/Black Striped Background Vector.jpg";
// @ts-ignore
import pattern5 from "../patterns/Ink Brush Grid Pattern.jpg";
// @ts-ignore
import pattern1 from "../patterns/Porous White.jpg";
// @ts-ignore
import dashPatternImage from "./dash_pattern.png";
// @ts-ignore
import kneePatternImage from "./knee_pattern.png";

const loader = new THREE.TextureLoader();
// const texture = loader.load(dashPatternImage);

const patterns = [
	loader.load(dashPatternImage),
	loader.load(kneePatternImage),
	loader.load(pattern1),
	loader.load(pattern2),
	loader.load(pattern3),
	loader.load(pattern4),
	loader.load(pattern5),
	loader.load(pattern6),
];

export class Cube {
	mesh: THREE.Mesh | null;
	scene: THREE.Scene;
	positionInitiated = false;
	targetPosition: THREE.Vector3 | null = null;
	targetScale: THREE.Vector3 | null = null;
	destroying = false;
	variant: CubeType | null = null;

	constructor(variant: string, scene: THREE.Scene) {
		this.scene = scene;
		this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), cubeMaterial());
		this.setVariant(variant);
		this.scene.add(this.mesh);
		TPane?.on("change", this.onTweakPaneChange);
		requestAnimationFrame(this.animate);
	}

	onTweakPaneChange = () => {
		this.setColor();
		this.setPattern();
		this.setThickness();
		this.setScale();
	};

	setColor() {
		if (!this.variant || !this.mesh) {
			return;
		}
		const material = this.mesh.material as THREE.ShaderMaterial;
		material.uniforms.u_color_top_bottom.value = new THREE.Color().setStyle(
			this.variant.faceColors.topBottom,
		);
		material.uniforms.u_color_left_right.value = new THREE.Color().setStyle(
			this.variant.faceColors.leftRight,
		);
		material.uniforms.u_color_front_back.value = new THREE.Color().setStyle(
			this.variant.faceColors.frontBack,
		);
	}

	setPattern() {
		if (!this.variant || !this.mesh) {
			return;
		}
		const material = this.mesh.material as THREE.ShaderMaterial;
		material.uniforms.u_pattern_factor.value = this.variant.patternFactor;
		material.uniforms.u_pattern_scale.value = this.variant.patternScale;
		material.uniforms.u_random_offset.value = new THREE.Vector2(
			Math.random() * this.variant.patternPositionRandomness,
			Math.random() * this.variant.patternPositionRandomness,
		);
		if (this.variant.patternFaceConfig.includes("V")) {
			material.uniforms.u_pattern_face_v.value = 1.0;
		} else {
			material.uniforms.u_pattern_face_v.value = 0.0;
		}
		if (this.variant.patternFaceConfig.includes("H")) {
			material.uniforms.u_pattern_face_h.value = 1.0;
		} else {
			material.uniforms.u_pattern_face_h.value = 0.0;
		}
		material.uniforms.u_texture.value =
			patterns[Math.min(this.variant.pattern, patterns.length - 1)];
	}

	setThickness() {
		if (!this.variant?.edge || !this.mesh) {
			return;
		}
		const material = this.mesh.material as THREE.ShaderMaterial;
		material.uniforms.u_thickness.value = this.variant.edge.thickness;
	}

	setVariant(newVariant: string) {
		this.variant = cubeVariants[newVariant];
		this.setColor();
		this.setPattern();
		this.setThickness();
		this.setScale();
	}

	setPosition(x: number, y: number, z: number) {
		if (this.mesh && !this.positionInitiated) {
			this.mesh.position.x = x;
			this.mesh.position.y = y;
			this.mesh.position.z = z;
			this.positionInitiated = true;
		} else {
			this.targetPosition = new THREE.Vector3(x, y, z);
		}
		return this;
	}

	setScale() {
		if (this.destroying) {
			return;
		}
		this.targetScale = new THREE.Vector3(
			this.variant?.scale || 1,
			this.variant?.scale || 1,
			this.variant?.scale || 1,
		);
		return this;
	}

	destroy() {
		this.destroying = true;
		this.targetScale = new THREE.Vector3(0, 0, 0);
	}

	animate = () => {
		if (!this.mesh) {
			return;
		}
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
		const material = this.mesh.material as THREE.ShaderMaterial;
		material.uniforms.u_time.value += 0.05;
	};
}

const cubeMaterial = () =>
	new THREE.ShaderMaterial({
		uniforms: {
			u_texture: { value: patterns[3] },
			u_pattern_factor: { value: 2.0 },
			u_pattern_scale: { value: 1.0 },
			u_pattern_face_h: { value: 0.0 },
			u_pattern_face_v: { value: 0.0 },
			u_random_offset: { value: new THREE.Vector2(0, 0) },
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
				value: 0.0,
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
      uniform sampler2D u_texture;
      uniform float u_thickness;
      uniform float u_time;
      varying vec2 vUv;
      varying vec3 vNormal;
      uniform vec3 u_color_top_bottom;
      uniform vec3 u_color_left_right;
      uniform vec3 u_color_front_back;
      uniform float u_pattern_factor;
      uniform float u_pattern_scale;
      uniform float u_pattern_face_h;
      uniform float u_pattern_face_v;
      uniform vec2 u_random_offset;

      void main() {
        float uvScale = u_pattern_scale;
        vec2 scaledUV = vUv * uvScale + u_random_offset;
        vec4 texColor = texture2D(u_texture, scaledUV);
        float thickness = u_thickness;
        vec3 color;
        vec3 absNor = abs(vNormal);

        float mixFactor = texColor.r; // Assuming the texture is grayscale

        if (vNormal.x > 0.9) color = u_color_left_right;
        else if (vNormal.x < -0.9) color = u_color_left_right;
        else if (vNormal.y > 0.9) color = u_color_top_bottom;
        else if (vNormal.y < -0.9) color = u_color_top_bottom;
        else if (vNormal.z > 0.9) color = u_color_front_back;
        else if (vNormal.z < -0.9) color = u_color_front_back;
        else color = vec3(1.0, 1.0, 1.0); // Shouldn't happen; set to White

				if (u_pattern_face_h == 1.0) {
					if (vNormal.x > 0.9 || vNormal.x < -0.9 || vNormal.z > 0.9 || vNormal.z < -0.9) {
		        color = mix(color + u_pattern_factor, color, mixFactor);
					}
        }

				if (u_pattern_face_v == 1.0) {
					if (vNormal.y > 0.9 || vNormal.y < -0.9 || vNormal.z > 0.9 || vNormal.z < -0.9) {
		        color = mix(color + u_pattern_factor, color, mixFactor);
					}
        }

        if (vUv.y < thickness || vUv.y > 1.0 - thickness || vUv.x < thickness || vUv.x > 1.0 - thickness) {
          gl_FragColor = vec4(0.03, 0.03, 0.03, 1.0);
        } else {
          gl_FragColor = LinearTosRGB(vec4(color, 1.0));
        }
      }
    `,
		transparent: true,
	});
