import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Vehicle } from './../vehicle';
import { ObstacleType } from '../draw-track/obstacle';
import { Cancellable } from './cancelable';

export class ObstacleCollisionEvent extends Cancellable {
    constructor(
        private vehicle: Vehicle,
        private obstacleType: ObstacleType
    ) {
        super();
    }

    public getVehicle(): Vehicle {
        return this.vehicle;
    }

    public getObstacle(): ObstacleType {
        return this.obstacleType;
    }
}

@Injectable()
export class ObstacleCollisionEventService {

    public eventListener = new Subject<ObstacleCollisionEvent>();

    public sendObstacleCollisionEvent(event) {
        this.eventListener.next(event);
    }

    public getObstacleCollisionObservable(): Observable<ObstacleCollisionEvent> {
        return this.eventListener.asObservable();
    }
}
