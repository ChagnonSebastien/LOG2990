import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent {
    public gameInProgress: boolean;
    public gameCompleted: boolean;

    constructor(
        public crosswordGameService: CrosswordGameService,
        private configurationService: CrosswordConfigurationService,
        private pointsService: CrosswordPointsService
    ) {
        this.gameInProgress = false;
        this.gameCompleted = false;
        this.listenForStartGame();
        this.listenForGameCompletion();
    }

    public endGame() {
        this.gameInProgress = false;
        this.gameCompleted = false;
    }

    private listenForStartGame() {
        this.configurationService.startGameAlerts()
            .subscribe(async (configuration) => {
                if (configuration.type === 'solo') {
                    await this.crosswordGameService.newSoloGame(configuration.level);
                    this.gameInProgress = true;
                } else if (configuration.type === 'multiplayer') {
                    await this.crosswordGameService.newMultiplayerGame(configuration.level, configuration.mode);
                }
            });

        this.crosswordGameService.gameStartAlerts()
            .subscribe((start) => {
                this.gameInProgress = true;
            });
    }

    private listenForGameCompletion() {
        this.pointsService.gameCompletedAlerts()
            .subscribe((end: boolean) => {
                this.gameCompleted = end;
            });
    }
}

