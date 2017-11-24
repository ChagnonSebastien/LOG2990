import { CountdownDecreaseEventService, CountdownDecreaseEvent } from './events/countdown-decrease-event';
import { Injectable } from '@angular/core';
import { CountdownService } from './countdown.service';
import { RacingGameService } from './racing-game.service';

@Injectable()
export class RaceMediator {

    constructor(
        private racingGGameService: RacingGameService,
        private countdownService: CountdownService,
        countdownDecreaseEventService: CountdownDecreaseEventService
    ) {
        countdownDecreaseEventService.getCountdownDecreaseObservable().subscribe(
            (event: CountdownDecreaseEvent) => this.handleCountdownDecreaseEvent(event)
        );
    }

    private handleCountdownDecreaseEvent(event: CountdownDecreaseEvent) {
        this.countdownService.updateCountdown(event.getNewAmount());

        if (event.getNewAmount() === 0) {
            this.racingGGameService.startGame();
            this.countdownService.startGame();
        }
    }
}
