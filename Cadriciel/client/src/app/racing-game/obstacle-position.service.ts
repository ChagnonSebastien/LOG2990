import { ObstacleType, Obstacle } from './draw-track/obstacle';
import { Track } from './track';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Settings } from './settings';

@Injectable()
export class ObstaclePositionService {

    private boosters: THREE.Vector2[];

    private potholes: THREE.Vector2[];

    private puddles: THREE.Vector2[];

    constructor() {
        this.boosters = [];
        this.potholes = [];
        this.puddles = [];
    }

    public initialize(track: Track) {
        this.potholes = this.calculateTypePositions(track.potholes, track.trackIntersections);
        this.puddles = this.calculateTypePositions(track.puddles, track.trackIntersections);
        this.boosters = this.calculateTypePositions(track.boosters, track.trackIntersections);
    }

    private calculateTypePositions(obstacles: Obstacle[], trackIntersections: THREE.Vector2[]): THREE.Vector2[] {
        return obstacles.map(obstacle => {
            return this.calculateIndividualPosition(obstacle, trackIntersections);
        });
    }

    private calculateIndividualPosition(obstacle: Obstacle, trackIntersections: THREE.Vector2[]): THREE.Vector2 {
        const segment = new THREE.Vector2().subVectors(
            trackIntersections[obstacle.segment + 1 === trackIntersections.length ? 0 : obstacle.segment + 1],
            trackIntersections[obstacle.segment]
        );
        const obstaclePosition = new THREE.Vector2().addVectors(
            trackIntersections[obstacle.segment],
            segment.multiplyScalar(obstacle.distance)
        );

        const lineAngle = Math.atan(segment.x / segment.y) + Math.PI / 2;
        const randomOffset = new THREE.Vector2(
            Math.sin(lineAngle), Math.cos(lineAngle)).multiplyScalar(obstacle.offset * Settings.TRACK_RADIUS * 2);

        return new THREE.Vector2(obstaclePosition.x + randomOffset.x, obstaclePosition.y + randomOffset.y);
    }

    public getObstacles(obstacleType: ObstacleType): THREE.Vector2[] {
        switch (obstacleType) {
            case ObstacleType.Booster:
                return this.boosters;
            case ObstacleType.Pothole:
                return this.potholes;
            case ObstacleType.Puddle:
                return this.puddles;
        }
    }

}
