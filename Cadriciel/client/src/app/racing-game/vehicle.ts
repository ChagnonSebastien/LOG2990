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

    public create3DVehicle(x: number, y: number, z: number): Promise<Vehicle> {
        const loader = new THREE.ObjectLoader();
        return new Promise<Vehicle>(resolve => {
            loader.load('/assets/cart.json', (object: THREE.Object3D) => {
            //console.log('z: ', object);
            this.vehicle = <THREE.Mesh>object;
            this.vehicle.geometry.rotateY(Math.PI / 2); // So that the front of the cart is oriented correctly in the scene
            this.vehicle.position.setX(x);
            this.vehicle.position.setY(y);
            this.vehicle.position.setZ(z);
            this.vehicle.scale.setX(22);
            this.vehicle.scale.setY(22);
            this.vehicle.scale.setZ(22);
            this.vehicle.castShadow = true;
            this.vehicleSubject.next('created');
            resolve(this);
            //console.log('x: ', x);
            //console.log('z: ', this.vehicle);
            }, (object: any) => {
                //console.log('prog: ', object);
            }, (object: any) => {
                //console.log('err: ', object);
            });
        });
    }
}
