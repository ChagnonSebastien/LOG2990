export class Controls {
    public speed: number;

    public acceleration: number;

    public rotationAngle: number;

    constructor(speed: number, acceleration: number, angle: number) {
        this.speed = speed;
        this.acceleration = acceleration;
        this.rotationAngle = angle;
    }

    public accelerate (object: any) {
        this.speed += this.acceleration;
        object.translateZ(-this.speed);
    }

    public brake (object: any) {
        if (this.speed > 0) {
            this.speed -= (this.acceleration * 1.5);
            object.translateZ(-this.speed);
        } else {
            this.speed = 0;
        }
    }

    public leftRotation(object: any) {
        object.rotation.y += this.rotationAngle;
    }

    public rightRotation(object: any) {
        object.rotation.y -= this.rotationAngle;
    }

}
