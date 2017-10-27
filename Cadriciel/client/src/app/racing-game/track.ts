import { Obstacle } from './draw-track/obstacle';
export class Track {

    public name: string;
    public description = '';
    public type: string;
    public trackIntersections: { x: number, y: number }[] = [];
    public numberOfTimesPlayed: number;
    public bestTimes: number[] = [];
    public rating: number;
    public puddles: Obstacle[] = [];
    public potholes: Obstacle[] = [];
    public boosters: Obstacle[] = [];

    constructor(
        name: string,
        description: string,
        type: string,
        intersections: { x: number, y: number }[],
        puddles: Obstacle[],
        potholes: Obstacle[],
        boosters: Obstacle[]
    ) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.trackIntersections = intersections;
        this.puddles = puddles;
        this.potholes = potholes;
        this.boosters = boosters;
        this.rating = -1;
        this.numberOfTimesPlayed = 0;
        this.bestTimes = [];
    }
}
