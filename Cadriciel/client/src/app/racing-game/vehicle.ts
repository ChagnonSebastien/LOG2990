import { Track } from './track';
import * as THREE from 'three';


export class Vehicle {
    public vehicle: THREE.Mesh;

    constructor() {
    }

    public create3DVehicle(track: Track, scale: number): Promise<Vehicle> {
        const loader = new THREE.ObjectLoader();
        return new Promise<Vehicle>(resolve => {
            loader.load('/assets/cart.json', (object: THREE.Object3D) => {
                this.vehicle = <THREE.Mesh>object;
                this.vehicle.geometry.rotateY(Math.PI / 2); // So that the front of the cart is oriented correctly in the scene
                const fromPosition = track.trackIntersections[0];
                const toPosition = track.trackIntersections[1];
                this.vehicle.rotateY(Math.PI / 2 - Math.atan((toPosition.y - fromPosition.y) / (toPosition.x - fromPosition.x)));
                this.vehicle.position.x = (((toPosition.x - fromPosition.x) / 2) + fromPosition.x) * scale;
                this.vehicle.position.z = (((toPosition.y - fromPosition.y) / 2) + fromPosition.y) * scale;
                this.vehicle.position.y = 20;
                this.vehicle.scale.set(22, 22, 22);
                this.vehicle.castShadow = true;
                resolve(this);
            });
        });
    }
}
