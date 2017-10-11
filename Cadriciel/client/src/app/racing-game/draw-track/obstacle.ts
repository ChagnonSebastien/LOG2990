export enum ObstacleType {
    Pothole,
    Puddle,
    Booster,
}

export class Obstacle {
    public type: ObstacleType;
    public intersection: number;
    public distance: number;
    public offset: number;

    constructor(type: ObstacleType, intersection: number, distance: number, offset: number) {
        this.type = type;
        this.intersection = intersection;
        this.distance = distance;
        this.offset = offset;
    }
}
