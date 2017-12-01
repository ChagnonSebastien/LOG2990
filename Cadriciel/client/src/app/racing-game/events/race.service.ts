import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


export class RaceEndedEvent {
    constructor() {
    }
}


@Injectable()
export class RaceService {
    private raceEndedSubject: Subject<RaceEndedEvent>;

    constructor() {
        this.raceEndedSubject = new Subject<RaceEndedEvent>();
    }

    public raceEndedAlerts(): Observable<any> {
        return this.raceEndedSubject.asObservable();
    }

    public endRace() {
        this.raceEndedSubject.next();
    }

}
