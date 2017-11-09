export enum ObstacleType {
    Pothole = 1.75,
    Puddle = 3,
    Booster = 2.75,
}

export class Obstacle {
    public type: ObstacleType;
    public segment: number;
    public distance: number;
    public offset: number;

    constructor(type: ObstacleType, intersection: number, distance: number, offset: number) {
        this.type = type;
        this.segment = intersection;
        this.distance = distance;
        this.offset = offset;
    }
}
