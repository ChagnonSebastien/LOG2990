import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class FrameEvent {
    constructor() {}
}

@Injectable()
export class FrameEventService {

    private eventListener = new Subject<FrameEvent>();

    public sendFrameEvent(event) {
        this.eventListener.next(event);
    }

    public getFrameObservable(): Observable<FrameEvent> {
        return this.eventListener.asObservable();
    }
}
