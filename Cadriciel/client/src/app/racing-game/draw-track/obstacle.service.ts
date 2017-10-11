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
        } while (this.isTooCloseToAnyOtherObstacle(obstacle));
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

    private isTooCloseToAnyOtherObstacle(obstacle: Obstacle): boolean {
        let tooClose = false;

        if (obstacle.type !== ObstacleType.Booster) {
            tooClose = tooClose || this.isTooCloseToAnyOtherObstacleInList(obstacle, this.boosters);
        }

        if (obstacle.type !== ObstacleType.Pothole) {
            tooClose = tooClose || this.isTooCloseToAnyOtherObstacleInList(obstacle, this.potholes);
        }

        if (obstacle.type !== ObstacleType.Puddle) {
            tooClose = tooClose || this.isTooCloseToAnyOtherObstacleInList(obstacle, this.puddles);
        }

        return tooClose;
    }

    private isTooCloseToAnyOtherObstacleInList(obstacle: Obstacle, obstacles: Obstacle[]): boolean {
        const service = this;
        obstacles.forEach((toCompare) => {
            if (service.isTooCloseOtherObstacle(obstacle, toCompare)) {
                return true;
            }
        });
        return false;
    }

    private isTooCloseOtherObstacle(obstacle1: Obstacle, obstacle2: Obstacle): boolean {
        if (obstacle1.intersection === obstacle2.intersection) {
            return this.isTooCloseOtherObstacleOnSameSegment(obstacle1, obstacle2);
        } else if (Math.abs(obstacle1.intersection - obstacle2.intersection) === 1) {
            return this.isTooCloseOtherObstacleOnAdjacentSegment(obstacle1, obstacle2);
        } else {
            return false;
        }
    }

    private isTooCloseOtherObstacleOnSameSegment(obstacle1: Obstacle, obstacle2: Obstacle): boolean {
        const firstIntersection = this.track[obstacle1.intersection];
        const secondIntersection = this.track[obstacle1.intersection + 1 === this.track.length ? 0 : obstacle1.intersection + 1];
        const segmentLength = this.distance(firstIntersection, secondIntersection);

        const distanceFromFirstIntersectionToObstacle1 = obstacle1.distance * segmentLength;
        const distanceFromFirstIntersectionToObstacle2 = obstacle2.distance * segmentLength;

        return Math.abs(distanceFromFirstIntersectionToObstacle1 - distanceFromFirstIntersectionToObstacle2) < 10;
    }

    private isTooCloseOtherObstacleOnAdjacentSegment(obstacle1: Obstacle, obstacle2: Obstacle): boolean {
        let firstobstacle;
        let secondObstacle;

        if (obstacle1.intersection < obstacle2.intersection) {
            firstobstacle = obstacle1;
            secondObstacle = obstacle2;
        } else {
            firstobstacle = obstacle2;
            secondObstacle = obstacle1;
        }

        const firstIntersection = this.track[firstobstacle.intersection];
        const secondIntersection = this.track[secondObstacle.intersection];
        const thirdIntersection = this.track[secondObstacle.intersection + 1 === this.track.length ? 0 : secondObstacle.intersection + 1];

        const firstSegmentLength = this.distance(firstIntersection, secondIntersection);
        const secondSegmentLength = this.distance(secondIntersection, thirdIntersection);

        const distanceFromSecondIntersectionToObstacle1 = (1 - obstacle1.distance) * firstSegmentLength;
        const distanceFromSecondIntersectionToObstacle2 = obstacle2.distance * secondSegmentLength;

        return distanceFromSecondIntersectionToObstacle1 + distanceFromSecondIntersectionToObstacle2 < 10;
    }

    public distance(point1: THREE.Vector2, point2: THREE.Vector2) {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    public randomizeAllPositions(type: ObstacleType) {

    }

    public getObstacles(type: ObstacleType) {

    }

    public removeAllObstacles() {

    }

}
