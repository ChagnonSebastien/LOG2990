import * as THREE from 'three';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

const VEHICLE_ROTATION_Y = 20.4;
export class Vehicle {
    public vehicle: THREE.Mesh;
    private vehicleSubject: Subject<any>;

    constructor() {
        this.vehicleSubject = new Subject();
        //alert('HELLO WORLD');
        // this.createVehicle();
    }

    public vehicleAlert(): Observable<any> {
        return this.vehicleSubject.asObservable();
    }

    public async createVehicle() {
        const loader = new THREE.ObjectLoader();
        await loader.load('/assets/cart.json', (object: THREE.Object3D) => {
            console.log('finished loading vehicle');
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
            this.vehicleSubject.next('created');
        }, (object: any) => {
            console.log('prog: ', object);
        }, (object: any) => {
            console.log('err: ', object);
        });

    }
}
