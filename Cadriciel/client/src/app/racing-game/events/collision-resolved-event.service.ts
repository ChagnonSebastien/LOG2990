import { Vehicle } from './../vehicle';
import { Subject } from 'rxjs/Subject';
import { Vector3 } from 'three';
import { Injectable } from '@angular/core';
import { Cancellable } from './cancelable';
import { Observable } from 'rxjs/Observable';

export class CollisionResolvedEvent extends Cancellable {
    constructor(
    ) {
        super();
    }
}

@Injectable()
export class CollisionResolvedEventService {

    private eventListener = new Subject<CollisionResolvedEvent>();

    public sendCollisionResolvedEvent(event) {
        console.log('RESOLVED');
        this.eventListener.next(event);
    }

    public getCollisionResolvedObservable(): Observable<CollisionResolvedEvent> {
        return this.eventListener.asObservable();
    }
}
