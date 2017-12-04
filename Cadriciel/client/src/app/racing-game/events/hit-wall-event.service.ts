import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class HitWallEvent {
    constructor() { }
}

@Injectable()
export class HitWallEventService {

    private eventListener = new Subject<HitWallEvent>();

    public sendHitWallEvent(event) {
        this.eventListener.next(event);
    }

    public getHitWallObservable(): Observable<HitWallEvent> {
        return this.eventListener.asObservable();
    }
}
