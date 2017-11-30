import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export class CountdownDecreaseEvent {
    constructor(
        private newAmount: number
    ) {}

    public getNewAmount(): number {
        return this.newAmount;
    }
}

@Injectable()
export class CountdownDecreaseEventService {
    private eventListener: Subject<CountdownDecreaseEvent>;

    constructor() {
        this.eventListener = new Subject();
    }

    public startCountDown(time: number) {
        const timer = Observable.timer(0, 1000).take(time).map(() => --time);
        timer.subscribe((timeLeft: number) => {
            this.sendCountdownDecreaseEvent(new CountdownDecreaseEvent(timeLeft));
        });
    }

    public sendCountdownDecreaseEvent(event) {
        this.eventListener.next(event);
    }

    public getCountdownDecreaseObservable(): Observable<CountdownDecreaseEvent> {
        return this.eventListener.asObservable();
    }
}
