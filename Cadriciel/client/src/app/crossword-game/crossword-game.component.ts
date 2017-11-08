import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent {
    public gameInProgress: boolean;

    constructor(
        public crosswordGameService: CrosswordGameService,
        private configurationService: CrosswordConfigurationService
    ) {
        this.gameInProgress = false;
        this.listenForStartGame();
    }

    public endGame() {
        this.gameInProgress = false;
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
}

