import { Obstacle, ObstacleType } from './obstacle';
import { Injectable } from '@angular/core';

@Injectable()
export class ObstacleService {

    private potholes: Obstacle[] = [];
    private puddles: Obstacle[] = [];
    private boosters: Obstacle[] = [];

    constructor() {}

    public addObstacle(type: ObstacleType) {

    }

    public randomizeAllPositions(type: ObstacleType) {

    }

    public getObstacles(type: ObstacleType) {

    }

    public removeAllObstacles() {

    }

}
