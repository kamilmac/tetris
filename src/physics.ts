import * as CANNON from "cannon-es";

export class Physics {
  world: any;
  boxes: any;

  constructor() {}

  attach(boxes: any) {
    this.world = new CANNON.World();
    this.boxes = boxes;
    this.world.gravity.set(Math.random() * 2 - 1, -10, Math.random() * 2 - 1); // Set gravity
    var groundMaterial = new CANNON.Material();
    var groundBody = new CANNON.Body({
      mass: 0, // Mass = 0 makes it static
      material: groundMaterial,
    });
    var groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2,
    ); // Rotate to match Three.js plane
    this.world.addBody(groundBody);

    for (let [_, box] of this.boxes) {
      // box?.mesh.animate();
      var shape = new CANNON.Box(
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
    for (let [_, box] of this.boxes) {
      box.mesh.position.copy(box._body.position);
      box.mesh.quaternion.copy(box._body.quaternion);
    }
  }
}
