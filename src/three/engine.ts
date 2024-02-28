import * as THREE from "three";
import { CFG, TPane } from "../config";
import { Physics } from "../physics";
import { Cube, Stage } from "../stage";
import { Bridge } from "../utils/bridge";
import { Camera } from "./camera";
import { Cube as Tetrino } from "./cube";
import { Floor } from "./floor";
import { shadowMaterial } from "./materials";

interface ShadowCube extends Cube {
	x: number;
	y: number;
	z: number;
}

export class Engine {
	private stage: Stage;
	private shadowCubes: ShadowCube[];
	private idsInStage: number[];
	private renderer?: THREE.WebGLRenderer;
	private scene?: THREE.Scene;
	private floor: Floor | null;
	physics: Physics | null;
	floorCenterX: number;
	floorCenterZ: number;
	boxes: Map<number, Tetrino | null>;
	camera?: Camera | null;
	usePhysics: boolean;
	shadowGroup: THREE.Group;

	constructor(stage: Stage, onReady: (engine: Engine) => void) {
		this.stage = stage;
		this.boxes = new Map();
		this.shadowCubes = [];
		this.shadowGroup = new THREE.Group();
		this.idsInStage = [];
		this.floorCenterX = 0;
		this.floorCenterZ = 0;
		this.floor = null;
		this.camera = null;
		this.physics = null;
		this.usePhysics = false;
		this.setup();
		TPane?.on("change", this.onTweakPaneChange);
		onReady(this);
	}

	onTweakPaneChange = () => {
		this.renderer?.setClearColor(CFG.background.color);
	};

	reset() {
		if (!this.camera || !this.floor || !this.physics) {
			return;
		}
		this.usePhysics = false;
		this.physics.timeActive = 0;
		this.camera.activeCamera = 0;
		this.floor.wallsHidden = false;
		this.camera.reset();
	}

	setup() {
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		const canvasRoot = document.getElementById("canvas-root");
		canvasRoot?.appendChild(this.renderer.domElement);
		this.scene = new THREE.Scene();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(CFG.background.color);
		this.renderer.setPixelRatio(window.devicePixelRatio);

		this.renderer.outputColorSpace = THREE.SRGBColorSpace;
		this.camera = new Camera(this.stage, this.renderer);
		this.floor = new Floor(
			CFG.stage.width,
			CFG.stage.depth,
			CFG.stage.limit,
			this.scene,
			this.camera,
		);
		this.physics = new Physics();
		window.addEventListener(
			"resize",
			() => {
				if (!this.camera || !this.renderer) {
					return;
				}
				this.camera.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.camera.updateProjectionMatrix();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
			},
			false,
		);
	}

	handleCube(cube: Cube, x: number, y: number, z: number) {
		if (!cube?.id || !this.scene) {
			return;
		}
		if (this.boxes.has(cube.id)) {
			const box = this.boxes.get(cube.id);
			box?.setPosition(x, y, z);
			if (cube.state === "locked") {
				const l = CFG.cubes.locked.length;
				const v = CFG.cubes.locked[y % l];
				box?.setVariant(v);
			}
			if (cube.state === "active") {
				this.shadowCubes.push({ ...cube, x, y, z });
			}
			return;
		}
		this.boxes.set(
			cube.id,
			new Tetrino(CFG.cubes.active, this.scene).setPosition(x, y, z),
		);
	}

	applyStage() {
		if (!this.scene) {
			return;
		}
		this.idsInStage = [];
		for (let x = 0; x < this.stage.width; x++) {
			for (let y = 0; y < this.stage.height; y++) {
				for (let z = 0; z < this.stage.depth; z++) {
					const cube = this.stage.cubes[x][y][z];
					if (cube) {
						cube.id && this.idsInStage.push(cube.id);
						this.handleCube(cube, x, y, z);
					}
				}
			}
		}
		for (const [id, box] of this.boxes) {
			if (box === null) {
				return;
			}
			if (!box.destroying && !this.idsInStage.includes(id)) {
				box.destroy();
			}
			if (box.mesh === null) {
				this.boxes.delete(id);
			}
		}
	}

	renderShadows() {
		if (!this.scene) {
			return;
		}
		this.scene.remove(this.shadowGroup);
		this.shadowGroup = new THREE.Group();
		let highestLockedYUnder = -1;
		let lowestShadowCubeY = 1000;
		for (const sc of this.shadowCubes) {
			const geometry = new THREE.BoxGeometry(1, 1, 1);
			const mesh = new THREE.Mesh(geometry, shadowMaterial);
			if (sc.y < lowestShadowCubeY) {
				lowestShadowCubeY = sc.y;
			}
			for (let yy = sc.y - 1; yy >= 0; yy -= 1) {
				if (this.stage.isCubeDefined(sc.x, yy, sc.z)) {
					if (this.stage.cubes[sc.x][yy][sc.z]?.state === "locked") {
						if (yy > highestLockedYUnder) {
							highestLockedYUnder = yy;
						}
					}
				}
			}
			mesh.position.x = sc.x;
			mesh.position.y = sc.y;
			mesh.position.z = sc.z;
			this.shadowGroup.add(mesh);
		}
		this.shadowGroup.position.y = highestLockedYUnder - lowestShadowCubeY + 1;
		if (
			highestLockedYUnder - lowestShadowCubeY + 1 !== 0 &&
			highestLockedYUnder - lowestShadowCubeY + 1 !== 1000
		) {
			this.scene.add(this.shadowGroup);
		}
		this.shadowCubes = [];
	}

	captureSceneWithPhysics() {
		if (this.usePhysics) {
			return;
		}
		this.physics?.attach(this.boxes);
		this.usePhysics = true;
	}

	animate() {
		if (!this.camera || !this.renderer || !this.scene || !this.floor) {
			return;
		}
		if (!this.usePhysics) {
			if (this.stage.dirty) {
				this.applyStage();
				this.renderShadows();
				this.stage.dirty = false;
			}
		} else {
			this.physics?.animate();
			this.floor.wallsHidden = true;
		}
		this.floor.animate();
		let firstActiveBox = null;
		for (const [_, box] of this.boxes) {
			box?.animate();
			if (box?.variant?.edge.thickness && !firstActiveBox) {
				firstActiveBox = box;
			}
		}
		if (firstActiveBox) {
			const pos = firstActiveBox.mesh?.getWorldPosition(new THREE.Vector3());
			if (pos) {
				pos.z += 0.45;
				pos.y += 0.45;
				const v = pos.project(this.camera.camera);
				Bridge.set("active_box_x", (v.x * 0.5 + 0.5) * window.innerWidth);
				Bridge.set("active_box_y", -(v.y * 0.5 - 0.5) * window.innerHeight);
			}
		}
		this.renderer.render(this.scene, this.camera.animate());
	}
}
