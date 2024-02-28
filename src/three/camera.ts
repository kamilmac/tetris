import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Stage } from "../stage";
import { appState } from "../state";
import { Bridge } from "../utils/bridge";

export class Camera {
	camera: THREE.PerspectiveCamera;
	stage: Stage;
	floorCenterX = 0;
	floorCenterZ = 0;
	cameraPositions: {
		x: number;
		z: number;
		pointer: { x: number; z: number };
	}[];
	controls: OrbitControls;
	renderer: THREE.WebGLRenderer;
	targetPosition: THREE.Vector3 | null = null;
	cameraInMotion = false;
	activeCamera: number;
	lastRotationTime: number;

	constructor(stage: Stage, renderer: THREE.WebGLRenderer) {
		this.lastRotationTime = 0;
		this.activeCamera = 0;
		this.stage = stage;
		this.renderer = renderer;
		this.floorCenterZ = this.stage.depth / 2 - 0.5;
		this.floorCenterX = this.stage.width / 2 - 0.5;
		this.cameraPositions = [
			{
				x: this.floorCenterX + this.stage.width - 5,
				z: this.floorCenterZ + this.stage.depth,
				pointer: {
					x: this.stage.width - 0.5,
					z: this.stage.depth - 0.5,
				},
			},
			{
				x: this.floorCenterX + this.stage.width,
				z: this.floorCenterZ - this.stage.depth + 5,
				pointer: {
					x: this.stage.width - 0.5,
					z: this.stage.depth - 0.5 - 6,
				},
			},
			{
				x: this.floorCenterX - this.stage.width + 5,
				z: this.floorCenterZ - this.stage.depth,
				pointer: {
					x: this.stage.width - 0.5 - 6,
					z: this.stage.depth - 0.5 - 6,
				},
			},
			{
				x: this.floorCenterX - this.stage.width,
				z: this.floorCenterZ + this.stage.depth - 5,
				pointer: {
					x: this.stage.width - 0.5 - 6,
					z: this.stage.depth - 0.5,
				},
			},
		];
		const width = window.innerWidth;
		const height = window.innerHeight;
		this.camera = new THREE.PerspectiveCamera(120, width / height, 0.1, 1000);
		this.camera.zoom = 2.4;

		appState.subscribe(["status"], (state) => {
			if (state.status === "inDemo") {
				// @ts-ignore
				this.camera._targetZoom = 2.4;
			} else {
				// @ts-ignore
				this.camera._targetZoom = 3.0;
			}
		});
		// const aspect = window.innerWidth / window.innerHeight;
		// const frustumSize = 12;
		// this.camera = new THREE.OrthographicCamera(
		//   (frustumSize * aspect) / -2,
		//   (frustumSize * aspect) / 2,
		//   frustumSize / 2,
		//   frustumSize / -2,
		//   1,
		//   1000,
		// );
		// this.camera.zoom = 0.8;

		this.reset();
		this.camera.updateProjectionMatrix();
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.target.set(this.floorCenterX, 0, this.floorCenterZ);
		this.controls.update();
	}

	reset() {
		this.setPosition(
			this.floorCenterX + this.stage.width - 5,
			this.stage.width * 2,
			this.floorCenterZ + this.stage.depth,
		);
	}

	centerOnScene() {
		if (!this.camera) {
			return;
		}
		const w = window.innerWidth;
		const h = window.innerHeight;

		this.camera.setViewOffset(w, h, 0, 0, w, h);
	}

	setPosition(x: number, y: number, z: number) {
		if (!this.targetPosition) {
			this.camera.position.x = x;
			this.camera.position.y = y;
			this.camera.position.z = z;
		}
		this.targetPosition = new THREE.Vector3(x, y, z);
	}

	lerp() {
		if (this.targetPosition) {
			this.camera.position.lerp(this.targetPosition, 0.08);
			const cameraDistanceToTarget = this.camera.position.distanceTo(
				this.targetPosition,
			);
			if (cameraDistanceToTarget < 0.005) {
				this.camera.position.set(
					this.targetPosition.x,
					this.targetPosition.y,
					this.targetPosition.z,
				);
				this.targetPosition = null;
			}
		}
	}

	doWobble() {
		const p = performance.now() / 2000;
		this.camera.position.x += Math.sin(p) / 20;
		this.camera.position.y += Math.cos(p) / 30;
		this.camera.position.z += Math.cos(p) / 30;
	}

	rotate = (dir: "right" | "left") => {
		this.lastRotationTime = performance.now();
		this.cameraInMotion = true;
		if (dir === "right") {
			this.activeCamera += 1;
			if (this.activeCamera >= this.cameraPositions.length) {
				this.activeCamera = 0;
			}
		}
		if (dir === "left") {
			this.activeCamera -= 1;
			if (this.activeCamera < 0) {
				this.activeCamera = this.cameraPositions.length - 1;
			}
		}
		this.setPosition(
			this.cameraPositions[this.activeCamera].x,
			this.camera.position.y,
			this.cameraPositions[this.activeCamera].z,
		);
	};

	animate() {
		this.doWobble();
		this.lerp();
		// @ts-ignore
		if (this.camera._targetZoom - this.camera.zoom > 0.01) {
			// @ts-ignore
			this.camera.zoom += (this.camera._targetZoom - this.camera.zoom) / 10;
		}
		if (
			this.cameraInMotion &&
			performance.now() - this.lastRotationTime > 400
		) {
			this.cameraInMotion = false;
		}
		this.camera.lookAt(
			new THREE.Vector3(this.floorCenterX, 0, this.floorCenterZ),
		);
		const p = this.cameraPositions[this.activeCamera];
		const pos = new THREE.Vector3(p.pointer.x, -0.5, p.pointer.z);
		const v = pos.project(this.camera);
		Bridge.set("stage_x", (v.x * 0.5 + 0.5) * window.innerWidth);
		Bridge.set("stage_y", -(v.y * 0.5 - 0.5) * window.innerHeight);
		this.camera.updateProjectionMatrix();
		return this.camera;
	}
}
