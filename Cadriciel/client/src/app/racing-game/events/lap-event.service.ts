import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class LapEvent {
    constructor(public lap: number) {
    }
}

@Injectable()
export class LapEventService {

    private eventListener = new Subject<LapEvent>();

    public sendLapEvent(event) {
        this.eventListener.next(event);
    }

    public getLapObservable(): Observable<LapEvent> {
        return this.eventListener.asObservable();
    }
}
