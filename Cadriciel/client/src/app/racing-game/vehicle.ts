import { ObstacleService } from './obstacle.service';
import { ObstacleType } from './draw-track/obstacle';
import { Track } from './track';
import { VehicleColor } from './vehicle-color';
import * as THREE from 'three';
import { Controller } from './controller';
import { Mesh } from 'three';
import * as SETTINGS from './settings';

const distanceBetweenCars = 5;

const assetsPath = '/assets';
const redCarPath = 'red_cart.json';
const greenCarPath = 'green_cart.json';
const blueCarPath = 'blue_cart.json';
const yellowCarPath = 'yellow_cart.json';

export class Vehicle {
    private vehicle: THREE.Mesh;

    private boundingBox: THREE.Mesh;

    private controler: Controller;

    private lastObstacleHit: { type: ObstacleType, index: number };

    private track: Track;

    constructor(
        private obstacleService: ObstacleService
    ) {}

    public getTrack(): Track {
        return this.track;
    }

    public getVehicle(): THREE.Mesh {
        return this.vehicle;
    }

    public setBoundingBox(boundingBox: Mesh) {
        this.vehicle.add(boundingBox);
        this.boundingBox = boundingBox;
    }

    public getBoundingBox(): THREE.Mesh {
        return this.boundingBox;
    }

    public move() {
        this.calculateObstacleCollision();
        this.controler.move(this);
    }

    public calculateObstacleCollision() {
        this.checkTypeObstacleCollision(ObstacleType.Pothole);
        this.checkTypeObstacleCollision(ObstacleType.Puddle);
        this.checkTypeObstacleCollision(ObstacleType.Booster);
    }

    private checkTypeObstacleCollision(type: ObstacleType) {
        this.obstacleService.getObstacles(type).map(puddle => {
            return this.distanceToObstacle(puddle);
        }).forEach((distance, index) => {
            this.isColliding(type, distance, index);
        });
    }

    public hitWall(speedModifier: number) {
        this.controler.hitWall(speedModifier);
    }

    private distanceToObstacle(obstaclePosition: THREE.Vector2) {
        const obstaclePositionClone = obstaclePosition.clone().multiplyScalar(SETTINGS.SCENE_SCALE);
        return Math.sqrt(
            Math.pow(obstaclePositionClone.x - this.vehicle.position.x, 2) +
            Math.pow(obstaclePositionClone.y - this.vehicle.position.z, 2)
        );
    }

    private isColliding(type: ObstacleType, distance: number, index: number) {
        if (this.lastObstacleHit !== undefined) {
            if (this.lastObstacleHit.type === type && this.lastObstacleHit.index === index) {
                return;
            }
        }
        if (distance < type * SETTINGS.SCENE_SCALE) {
            this.lastObstacleHit = { type: type, index: index };
            this.controler.hitObstacle(type);
        }
    }

    public create3DVehicle(track: Track, carPosition: VehicleColor, controller: Controller): Promise<Vehicle> {
        this.track = track;
        this.controler = controller;
        const loader = new THREE.ObjectLoader();
        const trackCenter = this.getCenterOfTrack(track);
        const trackAngle = this.getTrackAngle(track);
        const beta = this.calculateBeta(carPosition, trackAngle);
        return new Promise<Vehicle>(resolve => {
            loader.load(`${assetsPath}/${this.getCartPath(carPosition)}`, (object: THREE.Object3D) => {
                this.vehicle = <THREE.Mesh>object;
                this.vehicle.rotation.y = trackAngle;
                this.vehicle.position.x = (trackCenter.x + Math.cos(beta) * distanceBetweenCars) * SETTINGS.SCENE_SCALE;
                this.vehicle.position.z = (trackCenter.y + Math.sin(beta) * distanceBetweenCars) * SETTINGS.SCENE_SCALE;
                this.vehicle.position.y = 3;
                this.vehicle.scale.set(SETTINGS.SCENE_SCALE, SETTINGS.SCENE_SCALE, SETTINGS.SCENE_SCALE);
                this.vehicle.castShadow = true;
                resolve(this);
            });
        });
    }

    private getCartPath(carPosition: VehicleColor) {
        switch (carPosition) {
            case VehicleColor.red:
                return redCarPath;
            case VehicleColor.blue:
                return blueCarPath;
            case VehicleColor.green:
                return greenCarPath;
            case VehicleColor.yellow:
                return yellowCarPath;
        }
    }

    private getCenterOfTrack(track: Track): THREE.Vector2 {
        const fromPosition = track.trackIntersections[0];
        const toPosition = track.trackIntersections[1];
        const segment = new THREE.Vector2().subVectors(toPosition, fromPosition);
        const segmentCenter = new THREE.Vector2().addVectors(fromPosition, segment.multiplyScalar(0.5));
        const startCarsOffset = segment.clone().normalize().multiplyScalar(-10);
        const startPosition = new THREE.Vector2().addVectors(segmentCenter, startCarsOffset);

        return startPosition;
    }

    private getTrackAngle(track: Track): number {
        const fromPosition = track.trackIntersections[0];
        const toPosition = track.trackIntersections[1];
        const rawAngle = -Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x));
        return ((toPosition.x - fromPosition.x >= 0) ? rawAngle : rawAngle + Math.PI) - Math.PI / 2;
    }

    private calculateBeta(vehicleColor: VehicleColor, trackCenterAngle: number): number {
        return Math.PI / 4 - trackCenterAngle + ((vehicleColor - 1) * (Math.PI / 2));
    }
}
