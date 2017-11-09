import { Track } from './track';
import { VehiclesPosition } from './vehicle.service';
import * as THREE from 'three';

const distanceBetweenCars = 5;
const startOffset = 0.75;

const assetsPath = '/assets';
const redCarPath = 'red_cart.json';
const greenCarPath = 'green_cart.json';
const blueCarPath = 'blue_cart.json';
const yellowCarPath = 'yellow_cart.json';

export class Vehicle {
    public vehicle: THREE.Mesh;

    constructor() {
    }

    public create3DVehicle(track: Track, scale: number, carPosition: VehiclesPosition): Promise<Vehicle> {
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

    private getCartPath(carPosition: VehiclesPosition) {
        switch (carPosition) {
            case VehiclesPosition.first:
            return redCarPath;
            case VehiclesPosition.second:
            return blueCarPath;
            case VehiclesPosition.third:
            return greenCarPath;
            case VehiclesPosition.fourth:
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

    private calculateBeta(carPosition: VehiclesPosition, trackCenterAngle: number): number {
        const beta = Math.PI / 4 - trackCenterAngle + ((carPosition - 1) * (Math.PI / 2));

        return beta;
    }
}
