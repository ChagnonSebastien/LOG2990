import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.css'],
    providers: []
})
export class CountdownComponent {
    public countdown: Observable<number>;
    public count: number;

    constructor() {
        this.count = 60;
        this.startCountdown();
    }

    public startCountdown() {
        this.countdown = Observable.timer(0, 1000)
            .take(this.count)
            .map(() => --this.count);
    }

}
