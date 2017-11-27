import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Cancellable } from './cancelable';
import { Observable } from 'rxjs/Observable';
import { Vehicle } from '../vehicle';

export class VehicleRotateEvent extends Cancellable {
    constructor(
        private previousRotation: number,
        private newRotation: number,
        private vehicle: Vehicle
    ) {
        super();
    }

    public getPreviousRotation() {
        return this.previousRotation;
    }

    public getNewRotatiion(): number {
        return this.newRotation;
    }

    public setNewRotatiion(newRotation: number) {
        this.newRotation = newRotation;
    }

    public getVehicle(): Vehicle {
        return this.vehicle;
    }
}

@Injectable()
export class VehicleRotateEventService {

    private eventListener = new Subject<VehicleRotateEvent>();

    public sendVehicleRotateEvent(event) {
        this.eventListener.next(event);
    }

    public getVehicleRotateObservable(): Observable<VehicleRotateEvent> {
        return this.eventListener.asObservable();
    }
}
