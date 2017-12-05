import { Vehicle } from './../vehicle';
import { Subject } from 'rxjs/Subject';
import { Vector3 } from 'three';
import { Injectable } from '@angular/core';
import { Cancellable } from './cancelable';
import { Observable } from 'rxjs/Observable';

export class CollisionEvent extends Cancellable {
    constructor(
        private firstVehicle: Vehicle,
        private secondVehicle: Vehicle,
        private collisionPoint: Vector3,
        private pointOnCollisionPlane: Vector3
    ) {
        super();
    }

    public getFirstVehicle(): Vehicle {
        return this.firstVehicle;
    }

    public getSecondVehicle(): Vehicle {
        return this.secondVehicle;
    }

    public getCollisionPoint(): Vector3 {
        return this.collisionPoint;
    }

    public getPointOnCollisionPlane(): Vector3 {
        return this.pointOnCollisionPlane;
    }
}

@Injectable()
export class CollisionEventService {

    public eventListener = new Subject<CollisionEvent>();

    public sendCollisionEvent(event) {
        console.log('BANG');
        this.eventListener.next(event);
    }

    public getCollisionObservable(): Observable<CollisionEvent> {
        return this.eventListener.asObservable();
    }
}
