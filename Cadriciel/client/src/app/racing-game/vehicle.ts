import { ObstacleService } from './obstacle.service';
import { ObstacleType } from './draw-track/obstacle';
import { Track } from './track';
import { VehicleColor } from './vehicle-color';
import * as THREE from 'three';
import {Controller} from './controller';

const distanceBetweenCars = 5;
const startOffset = 0.75;

const assetsPath = '/assets';
const redCarPath = 'red_cart.json';
const greenCarPath = 'green_cart.json';
const blueCarPath = 'blue_cart.json';
const yellowCarPath = 'yellow_cart.json';

export class Vehicle {
    private vehicle: THREE.Mesh;

    private controler: Controller;

    private scale: number;

    private activeObstacleModifier: {type: ObstacleType, index: number};

    constructor(private obstacleService: ObstacleService) {
    }

    public getVehicle(): THREE.Mesh {
        return this.vehicle;
    }

    public move() {
        this.calculateObstacleCollision();
        this.controler.move(this.vehicle);
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

    private distanceToObstacle(obstaclePosition: THREE.Vector2) {
        const obstaclePositionClone = obstaclePosition.clone().multiplyScalar(this.scale);
        return Math.sqrt(
            Math.pow(obstaclePositionClone.x - this.vehicle.position.x, 2) +
            Math.pow(obstaclePositionClone.y - this.vehicle.position.z, 2)
        );
    }

        private isColliding(type: ObstacleType, distance: number, index: number) {
            if (this.activeObstacleModifier !== undefined) {
                if (this.activeObstacleModifier.type === type && this.activeObstacleModifier.index === index) {
                    return;
                }
            }
            if (distance < type * this.scale) {
                this.activeObstacleModifier = {type: type, index: index};
            }
        }

        public create3DVehicle(track: Track, scale: number, carPosition: VehicleColor, controller: Controller): Promise<Vehicle> {
            this.scale = scale;
            this.controler = controller;
            const loader = new THREE.ObjectLoader();
            const trackCenter = this.getCenterOfTrack(track);
            const trackAngle = this.getTrackAngle(track);
            const beta = this.calculateBeta(carPosition, trackAngle);
            return new Promise<Vehicle>(resolve => {
                loader.load(`${assetsPath}/${this.getCartPath(carPosition)}`, (object: THREE.Object3D) => {
                    this.vehicle = <THREE.Mesh>object;
                    this.vehicle.rotateY(trackAngle);
                    this.vehicle.position.x = (trackCenter.x + Math.cos(beta) * distanceBetweenCars) * scale;
                    this.vehicle.position.z = (trackCenter.y + Math.sin(beta) * distanceBetweenCars) * scale;
                this.vehicle.position.y = 3;
                this.vehicle.scale.set(scale, scale, scale);
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
        const xCenter = ((toPosition.x - fromPosition.x) / 2) * startOffset + fromPosition.x;
        const yCenter = ((toPosition.y - fromPosition.y) / 2) * startOffset + fromPosition.y;
        const center = new THREE.Vector2(xCenter, yCenter);

        return center;
    }

    private getTrackAngle(track: Track): number {
        const fromPosition = track.trackIntersections[0];
        const toPosition = track.trackIntersections[1];
        const angle = Math.PI / 2 - Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x));

        return angle;
    }

    private calculateBeta(vehicleColor: VehicleColor, trackCenterAngle: number): number {
        return Math.PI / 4 - trackCenterAngle + ((vehicleColor - 1) * (Math.PI / 2));
    }
}
