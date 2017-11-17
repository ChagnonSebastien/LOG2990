import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RaceService {
    private raceEndedSubject: Subject<any>;

    constructor() {
        this.raceEndedSubject = new Subject();
    }

    public raceEndedAlerts(): Observable<any> {
        return this.raceEndedSubject.asObservable();
    }

    private endRace() {
        this.raceEndedSubject.next();
    }

}
