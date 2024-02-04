import * as CANNON from "cannon-es";

export class Physics {
	world: CANNON.World | null;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	boxes: any;
	timeActive: number;
	startTime?: number;

	constructor() {
		this.world = null;
		this.timeActive = 0;
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	attach(boxes: any) {
		this.timeActive = 0;
		this.startTime = performance.now();
		this.world = new CANNON.World();
		this.boxes = boxes;
		this.world.gravity.set(Math.random() * 2 - 1, -10, Math.random() * 2 - 1); // Set gravity
		const groundMaterial = new CANNON.Material();
		const groundBody = new CANNON.Body({
			mass: 0, // Mass = 0 makes it static
			material: groundMaterial,
		});
		const groundShape = new CANNON.Plane();
		groundBody.addShape(groundShape);
		groundBody.quaternion.setFromAxisAngle(
			new CANNON.Vec3(1, 0, 0),
			-Math.PI / 2,
		); // Rotate to match Three.js plane
		this.world.addBody(groundBody);

		for (const [_, box] of this.boxes) {
			// box?.mesh.animate();
			const shape = new CANNON.Box(
				new CANNON.Vec3(
					box.mesh.scale.x / 2,
					box.mesh.scale.y / 2,
					box.mesh.scale.z / 2,
				),
			);
			box._body = new CANNON.Body({
				mass: 10, // Set the mass of the body
				position: new CANNON.Vec3(
					box.mesh.position.x,
					box.mesh.position.y,
					box.mesh.position.z,
				), // Initial position
			});
			box._body.addShape(shape);
			this.world.addBody(box._body);
		}
	}

	animate() {
		this.world?.step(1 / 60);
		if (this.startTime === undefined) {
			return;
		}
		this.timeActive = performance.now() - this.startTime;
		for (const [_, box] of this.boxes) {
			box.mesh.position.copy(box._body.position);
			box.mesh.quaternion.copy(box._body.quaternion);
		}
	}
}
