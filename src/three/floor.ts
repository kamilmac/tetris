import * as THREE from "three";
import { Scene } from "three";
import { CFG, TPane } from "../config";
import { Camera } from "./camera";

export class Floor {
	camera: Camera;
	wallsHidden: boolean;
	floor: THREE.Group;
	wallL: THREE.Group;
	wallB: THREE.Group;
	wallR: THREE.Group;
	wallF: THREE.Group;

	constructor(
		width: number,
		depth: number,
		height: number,
		scene: Scene,
		camera: Camera,
	) {
		this.wallsHidden = false;
		this.camera = camera;

		this.floor = this.renderPlaneGrid(width, depth);
		this.wallL = this.renderPlaneGrid(width, height);
		this.wallB = this.renderPlaneGrid(width, height);
		this.wallR = this.renderPlaneGrid(width, height);
		this.wallF = this.renderPlaneGrid(width, height);

		this.floor.position.y -= 0.5;
		scene?.add(this.floor);

		this.wallL.rotation.z = Math.PI / 2;
		this.wallL.rotation.x = Math.PI / 2;
		this.wallL.position.y += width / 2;
		this.wallL.position.x -= 0.5;
		scene?.add(this.wallL);

		this.wallB.rotation.x = Math.PI / 2;
		this.wallB.position.y += width / 2;
		this.wallB.position.z -= 0.5;
		scene?.add(this.wallB);

		this.wallR.rotation.z = Math.PI / 2;
		this.wallR.rotation.x = Math.PI / 2;
		this.wallR.position.y += width / 2;
		this.wallR.position.x += width - 0.5;
		scene?.add(this.wallR);

		this.wallF.rotation.x = Math.PI / 2;
		this.wallF.position.y += width / 2;
		this.wallF.position.z += width - 0.5;
		scene?.add(this.wallF);

		TPane?.on("change", this.onTweakPaneChange);
	}

	hideWalls() {
		this.wallsHidden = true;
	}

	onTweakPaneChange = () => {
		for (let i = 0; i < this.floor.children.length; i++) {
			const p = this.floor.children[i] as THREE.Mesh;
			const material = p.material as THREE.MeshBasicMaterial;
			material.color.set(CFG.enclosure.color);
		}
		for (let i = 0; i < this.wallL.children.length; i++) {
			const p = this.wallL.children[i] as THREE.Mesh;
			const material = p.material as THREE.MeshBasicMaterial;
			material.color.set(CFG.enclosure.color);
		}
		for (let i = 0; i < this.wallB.children.length; i++) {
			const p = this.wallB.children[i] as THREE.Mesh;
			const material = p.material as THREE.MeshBasicMaterial;
			material.color.set(CFG.enclosure.color);
		}
		for (let i = 0; i < this.wallR.children.length; i++) {
			const p = this.wallR.children[i] as THREE.Mesh;
			const material = p.material as THREE.MeshBasicMaterial;
			material.color.set(CFG.enclosure.color);
		}
		for (let i = 0; i < this.wallF.children.length; i++) {
			const p = this.wallF.children[i] as THREE.Mesh;
			const material = p.material as THREE.MeshBasicMaterial;
			material.color.set(CFG.enclosure.color);
		}
	};

	animate() {
		if (this.wallsHidden) {
			this.wallL.visible = false;
			this.wallB.visible = false;
			this.wallR.visible = false;
			this.wallF.visible = false;
			return;
		}
		switch (this.camera.activeCamera) {
			case 0:
				this.wallL.visible = true;
				this.wallB.visible = true;
				this.wallR.visible = false;
				this.wallF.visible = false;
				break;
			case 1:
				this.wallL.visible = true;
				this.wallB.visible = false;
				this.wallR.visible = false;
				this.wallF.visible = true;
				break;
			case 2:
				this.wallL.visible = false;
				this.wallB.visible = false;
				this.wallR.visible = true;
				this.wallF.visible = true;
				break;
			case 3:
				this.wallL.visible = false;
				this.wallB.visible = true;
				this.wallR.visible = true;
				this.wallF.visible = false;
				break;
			default:
				break;
		}
	}

	renderPlaneGrid(w: number, h: number) {
		const group = new THREE.Group();
		for (let x = 0; x < w; x += 1) {
			for (let z = 0; z < h; z += 1) {
				const p = this.renderPlane();
				p.position.x = x;
				p.position.z = z;
				group.add(p);
			}
		}
		return group;
	}

	renderPlane() {
		const scale = 0.95;
		const geometry = new THREE.PlaneGeometry(1, 1);
		const line = new THREE.Mesh(
			geometry,
			new THREE.MeshBasicMaterial({
				color: CFG.enclosure.color,
			}),
		);
		line.material.side = THREE.DoubleSide;
		line.material.depthTest = false;
		line.scale.set(scale, scale, scale);
		line.rotation.x = Math.PI / 2;
		return line;
	}
}
