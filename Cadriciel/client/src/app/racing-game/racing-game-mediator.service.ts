import { CommandsService, CommandEvent, PlayerCommand } from './events/commands.service';
import { CountdownDecreaseEventService, CountdownDecreaseEvent } from './events/countdown-decrease-event';
import { Injectable } from '@angular/core';
import { CountdownService } from './countdown.service';
import { RacingGameService } from './racing-game.service';

@Injectable()
export class RaceMediator {

    constructor(
        private racingGGameService: RacingGameService,
        private countdownService: CountdownService,
        commandsService: CommandsService,
        countdownDecreaseEventService: CountdownDecreaseEventService,

    ) {
        countdownDecreaseEventService.getCountdownDecreaseObservable().subscribe(
            (event: CountdownDecreaseEvent) => this.handleCountdownDecreaseEvent(event)
        );

        commandsService.getCommandKeyUpObservable().subscribe(
            (event: CommandEvent) => this.handleKeyUpEvent(event)
        );

        commandsService.getCommandKeyDownObservable().subscribe(
            (event: CommandEvent) => this.handleKeyDownEvent(event)
        );
    }

    private handleKeyUpEvent(event: CommandEvent) {
    }

    private handleKeyDownEvent(event: CommandEvent) {
        if (event.getCommand() === PlayerCommand.START_GAME) {
            this.countdownService.startCountdown();
        }
    }

    private handleCountdownDecreaseEvent(event: CountdownDecreaseEvent) {
        this.countdownService.updateCountdown(event.getNewAmount());

        if (event.getNewAmount() === 0) {
            this.racingGGameService.startGame();
            this.countdownService.startGame();
        }
    }
}
