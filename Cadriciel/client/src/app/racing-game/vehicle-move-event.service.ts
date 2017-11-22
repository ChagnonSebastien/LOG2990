import { Subject } from 'rxjs/Subject';
import { Vector3 } from 'three';
import { Injectable } from '@angular/core';
import { Cancellable } from './cancelable';
import { Observable } from 'rxjs/Observable';
import { Vehicle } from './vehicle';

@Injectable()
export class VehicleMoveEventService {

    private eventListener = new Subject<VehicleMoveEvent>();

    public sendVehicleMoveEvent(event) {
        this.eventListener.next(event);
    }

    public getVehicleMoveObservable(): Observable<VehicleMoveEvent> {
        return this.eventListener.asObservable();
    }
}

export class VehicleMoveEvent extends Cancellable {
    constructor(
        private previousPosition: Vector3,
        private newPosition: Vector3,
        private vehicle: Vehicle
    ) {
        super();
    }

    public getPreviousPosition() {
        return this.previousPosition;
    }

    public getNewPosition() {
        return this.newPosition;
    }

    public setNewPosition(newPosition: Vector3) {
        this.newPosition = newPosition;
    }

    public getVehicle(): Vehicle {
        return this.vehicle;
    }
}
