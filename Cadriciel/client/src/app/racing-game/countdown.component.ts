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
    private countdown: Observable<number>;
    private count: number;
    private countdownStarted: boolean;

    constructor(private countdownService: CountdownService) {
        this.count = 10;
        this.countdownStarted = false;
    }

    private startCountdown(event: any) {
        if (event.keyCode === 32 && this.countdownStarted === false) {
            this.countdownStarted = true;
            this.countdown = this.countdownService.startCountdown(this.countdown, this.count);
        }
    }

    @HostListener('window:keydown', ['$event'])
    public onStartRace() {
        this.startCountdown(event);
    }
}
