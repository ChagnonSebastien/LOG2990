import { Obstacle, ObstacleType } from './obstacle';
import { Injectable } from '@angular/core';

@Injectable()
export class ObstacleService {

    private potholes: Obstacle[] = [];
    private puddles: Obstacle[] = [];
    private boosters: Obstacle[] = [];

    constructor() {}

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
            list = [];
            break;
        }
    }

    private newObstacle(type: ObstacleType): Obstacle {
        return null;
    }

    public randomizeAllPositions(type: ObstacleType) {

    }

    public getObstacles(type: ObstacleType) {

    }

    public removeAllObstacles() {

    }

}
