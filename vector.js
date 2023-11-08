function toDegrees(radians) {
    return radians * 180 / Math.PI;
}
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

class PolarVector {
    constructor(magnitude, angle) {
        this.magnitude = magnitude;
        this.angle = angle;
    }

    rotate(angle) {
        return new PolarVector(this.magnitude, this.angle + angle);
    }
    toCartesian() {
        let radAngle = toRadians(this.angle);
        return new Vector(this.magnitude * Math.cos(radAngle), this.magnitude * Math.sin(radAngle));
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(vector1, vector2) {
        return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    static substract(vector1, vector2) {
        return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
    }
    static opposite(vector) {
        return new Vector(-vector.x, -vector.y);
    }
    static leftNormal(vector) {
        return new Vector(-vector.y, vector.x);
    }
    static rightNormal(vector) {
        return new Vector(vector.y, -vector.x);
    }
    static multiply(vector, scalar) {
        return new Vector(vector.x * scalar, vector.y * scalar);
    }
    length() {
        return Math.sqrt(this.lengthSquared());
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    static unitVector(vector) {
        return Vector.multiply(vector, 1 / vector.length());
    }
    static rotate(vector, angle) {
        return vector.toPolars().rotate(angle).toCartesian();
    }
    toPolars() {
        return new PolarVector(this.length(), toDegrees(Math.atan2(this.y, this.x)));
    }
}

