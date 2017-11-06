import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CountdownService } from './countdown.service';

@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.css'],
    providers: [CountdownService]
})
export class CountdownComponent {
    public countdown: Observable<number>;
    public count: number;

    constructor(private countdownService: CountdownService) {
        this.count = 60;
    }

    public startCountdown(event: any) {
        if (event.keyCode === 32) {
            this.countdown = this.countdownService.startCountdown(this.countdown, this.count);
        }
    }

    @HostListener('window:keydown', ['$event'])
    public onStartRace() {
        this.startCountdown(event);
    }
}
