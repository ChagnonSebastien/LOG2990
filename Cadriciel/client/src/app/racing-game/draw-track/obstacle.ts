enum ObstacleType {
    Pothole,
    Puddle,
    Booster,
}

export class Obstacle {
    public type: ObstacleType;
    public distance: number;
    public offset: number;
    public intersection: number;

    constructor(type: ObstacleType, distance: number, offset: number, intersection: number) {
        this.type = type;
        this.distance = distance;
        this.offset = offset;
        this.intersection = intersection;
    }
}
