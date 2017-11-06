import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class CountdownService {

    public startCountdown(countdown: Observable<number>, count: number): Observable<number> {
        countdown = Observable.timer(0, 1000)
            .take(count)
            .map(() => --count);
        return countdown;
    }

}
