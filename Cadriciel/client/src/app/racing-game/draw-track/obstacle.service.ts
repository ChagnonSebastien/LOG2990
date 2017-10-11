import { Obstacle, ObstacleType } from './obstacle';
import { Injectable } from '@angular/core';

@Injectable()
export class ObstacleService {

    private potholes: Obstacle[] = [];
    private puddles: Obstacle[] = [];
    private boosters: Obstacle[] = [];

    private track: THREE.Vector2[];

    constructor() {}

    public initialize(track: THREE.Vector2[]) {
        this.track = track;
    }

    public addObstacle(type: ObstacleType) {
        switch (type) {
            case ObstacleType.Booster:
            this.addObstacleToList(this.boosters, type);
            break;

            case ObstacleType.Pothole:
            this.addObstacleToList(this.potholes, type);
            break;

            case ObstacleType.Puddle:
            this.addObstacleToList(this.puddles, type);
            break;
        }
    }

    private addObstacleToList(list: Obstacle[], type: ObstacleType) {
        switch (list.length) {
        case 1:
        case 3:
            list.push(this.newObstacle(type));
        /* falls through */
        case 0:
            list.push();
            break;
        default:
            while (list.length > 0) {
                list.pop();
            }
            break;
        }
    }

    private newObstacle(type: ObstacleType): Obstacle {
        let obstacle: Obstacle;
        do {
            obstacle = new Obstacle(type, this.randomSegment(), this.randomDistance(type === ObstacleType.Booster), this.randomOffset());
        } while (this.isTooCloseToOtherObstacle(obstacle));
        return obstacle;
    }

    public randomSegment(): number {
        return Math.floor(Math.random() * (this.track.length - 1)) + 1;
    }

    public randomDistance(obstacleIsABooster: boolean): number {
        let distance = Math.random();
        if (obstacleIsABooster) {
            distance /= 2;
            distance += 0.5;
        }
        return distance;
    }

    public randomOffset(): number {
        return ((Math.random() * 2) - 1) * (3 / 4);
    }

    private isTooCloseToOtherObstacle(obstacle: Obstacle): boolean {
        return false;
    }

    public randomizeAllPositions(type: ObstacleType) {

    }

    public getObstacles(type: ObstacleType) {

    }

    public removeAllObstacles() {

    }

}
