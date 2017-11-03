import * as THREE from 'three';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';


export class Vehicle {
    public vehicle: THREE.Mesh;
    private vehicleSubject: Subject<any>;

    constructor() {
        this.vehicleSubject = new Subject();
    }

    public vehicleAlert(): Observable<any> {
        return this.vehicleSubject.asObservable();
    }

    public async createVehicle(x: number, y: number, z: number) {
        const loader = new THREE.ObjectLoader();
        await loader.load('/assets/cart.json', (object: THREE.Object3D) => {
            console.log('z: ', object);
            this.vehicle = <THREE.Mesh>object;
            this.vehicle.geometry.rotateY(Math.PI / 2); // So that the front of the cart is oriented correctly in the scene
            this.vehicle.position.setX(x);
            this.vehicle.position.setY(y);
            this.vehicle.position.setZ(z);
            this.vehicle.scale.setX(22);
            this.vehicle.scale.setY(22);
            this.vehicle.scale.setZ(22);
            this.vehicle.castShadow = true;
            console.log('x: ', x);
            console.log('z: ', this.vehicle);
            this.vehicleSubject.next('created');
        }, (object: any) => {
            console.log('prog: ', object);
        }, (object: any) => {
            console.log('err: ', object);
        });

    }
}
