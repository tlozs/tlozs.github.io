class Galaxy {
    constructor(name, bodies = []) {
        this.name = name;
        this.bodies = bodies;
    }

    move(vector) {
        for (const body of this.bodies) {
            body.p.add(vector);
        }
    }

    centerOfGravity() {
        let center = new Vector(0, 0);
        for (const body of this.bodies) {
            center.add(body.p);
        }
        return Vector.multiply(center, 1 / this.bodies.length);
    }
    centerOfMass() {

    }
}