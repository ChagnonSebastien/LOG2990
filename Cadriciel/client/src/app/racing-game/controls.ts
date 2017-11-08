export class Controls {
    private speed: number;

    private acceleration: number;

    private rotationAngle: number;

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
        this.speed -= this.acceleration;
        object.translateZ(-this.speed);
    }

    public leftRotation(object: any) {
        object.rotation.y = this.rotationAngle;
    }

    public rightRotation(object: any) {
        object.rotation.y = -this.rotationAngle;
    }
}
