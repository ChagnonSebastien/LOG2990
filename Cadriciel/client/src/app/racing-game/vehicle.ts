import * as THREE from 'three';

const VEHICLE_ROTATION_Y = 20.4;
export class Vehicle {
    public vehicle: THREE.Mesh;

    public createVehicle() {
        const service = this;
        const loader = new THREE.ObjectLoader();
        loader.load('/assets/cart.json', (object: THREE.Object3D) => {
            console.log('z: ', object);
            this.vehicle = <THREE.Mesh>object;
            this.vehicle.position.setX(0);
            this.vehicle.position.setY(0);
            this.vehicle.position.setZ(0);
            this.vehicle.scale.setX(50);
            this.vehicle.scale.setY(50);
            this.vehicle.scale.setZ(50);
            this.vehicle.rotation.y = VEHICLE_ROTATION_Y;
            console.log('z: ', this.vehicle);
        }, (object: any) => {
            console.log('prog: ', object);
        }, (object: any) => {
            console.log('err: ', object);
        });
    }
}
