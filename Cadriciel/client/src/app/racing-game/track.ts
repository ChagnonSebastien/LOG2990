import { LineCalculationService } from './line-calculation.service';
import { Obstacle } from './draw-track/obstacle';
import * as THREE from 'three';

const trackRadius = 10;

export class Track {

    public name: string;
    public description: string;
    public type: string;
    public trackIntersections: THREE.Vector2[];
    public numberOfTimesPlayed: number;
    public bestTimes: number[];
    public rating: number;
    public puddles: Obstacle[];
    public potholes: Obstacle[];
    public boosters: Obstacle[];

    constructor(
        name: string,
        description: string,
        type: string,
        intersections: THREE.Vector2[],
        puddles: Obstacle[],
        potholes: Obstacle[],
        boosters: Obstacle[],
        rating: number,
        numberOfTimesPlayed: number,
        bestTimes: number[]

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

    public distanceToPoint(point: THREE.Vector2, lineCalculationService: LineCalculationService) {
        return Math.min.apply(null, this.trackIntersections.map( (intersection, index, array) => {
            const line = {point1: intersection, point2: array[index + 1 === array.length ? 0 : index + 1]};
            const nearestPoint = lineCalculationService.getNearestPointOnLineWithClamping(point, line);
            return lineCalculationService.distance(point, nearestPoint) - trackRadius;
        }));
    }

    public centerOfFirstSegment(): { position: THREE.Vector2, rotation: number } {
        const segment = new THREE.Vector2().subVectors(this.trackIntersections[1], this.trackIntersections[0]);
        const position = new THREE.Vector2((segment.x / 2) + this.trackIntersections[0].x, (segment.y / 2) + this.trackIntersections[0].y);
        const rotation = - Math.atan((segment.y) / (segment.x));
        return {position, rotation};
    }
}
