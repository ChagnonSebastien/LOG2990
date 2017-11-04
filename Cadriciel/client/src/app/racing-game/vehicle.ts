import * as THREE from 'three';


export class Vehicle {
    public vehicle: THREE.Mesh;

    constructor() {
    }

    public create3DVehicle(x: number, y: number, z: number): Promise<Vehicle> {
        const loader = new THREE.ObjectLoader();
        return new Promise<Vehicle>(resolve => {
            loader.load('/assets/cart.json', (object: THREE.Object3D) => {
            this.vehicle = <THREE.Mesh>object;
            this.vehicle.geometry.rotateY(Math.PI / 2); // So that the front of the cart is oriented correctly in the scene
            this.vehicle.position.setX(x);
            this.vehicle.position.setY(y);
            this.vehicle.position.setZ(z);
            this.vehicle.scale.setX(22);
            this.vehicle.scale.setY(22);
            this.vehicle.scale.setZ(22);
            this.vehicle.castShadow = true;
            resolve(this);
            }, (object: any) => {
                console.log('prog: ', object);
            }, (object: any) => {
                console.log('err: ', object);
            });
        });
    }
}
