import { Track } from './track';
import { VehiclesPosition } from './vehicle.service';
import * as THREE from 'three';

const distanceBetweenCars = 5;
const startOffset = 0.75;

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
            loader.load('/assets/cart.json', (object: THREE.Object3D) => {
                this.vehicle = <THREE.Mesh>object;
                this.vehicle.geometry.rotateY(Math.PI / 2); // So that the front of the cart is oriented correctly in the scene
                this.vehicle.rotateY(trackAngle);
                this.vehicle.position.x = (trackCenter.x + Math.cos(beta) * distanceBetweenCars) * scale;
                this.vehicle.position.z = (trackCenter.y + Math.sin(beta) * distanceBetweenCars) * scale;
                this.vehicle.position.y = (scale * 20 / 25) + 3;
                this.vehicle.scale.set(scale * 22 / 25, scale * 22 / 25, scale * 22 / 25);
                this.vehicle.castShadow = true;
                resolve(this);
            });
        });
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
