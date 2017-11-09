import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

export class Countdown {
    public count: number;
    public initialCount: number;
    private countdownId: number;
    private countdownReachedZero: Subject<any>;
    private countdownSubject: Subject<any>;

    constructor() {
        this.countdownReachedZero = new Subject();
        this.countdownSubject = new Subject();
        this.initialCount = 30;
        this.resetCountdown();
    }

    public countdownReachedZeroAlerts(): Observable<any> {
        return this.countdownReachedZero.asObservable();
    }

    public countdownAlerts(): Observable<any> {
        return this.countdownSubject.asObservable();
    }

    public startCountdown() {
        this.countdownId = setInterval(this.decrementCounter.bind(this), 1000);
    }

    public stopCountdown() {
        if (this.countdownId !== undefined) {
            clearInterval(this.countdownId);
        }
    }

    public resetCountdown() {
        this.count = this.initialCount;
        this.countdownSubject.next(this.count);
    }

    private decrementCounter() {
        if (this.count > 0) {
            this.count--;
            this.countdownSubject.next(this.count);
        } else {
            this.countdownReachedZero.next(true);
            this.resetCountdown();
        }
    }
}
