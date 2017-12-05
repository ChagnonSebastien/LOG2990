import { Component } from '@angular/core';

import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { CrosswordGameManagerService } from '../game-manager/crossword-game-manager.service';

@Component({
    selector: 'app-crossword-end-game',
    templateUrl: './crossword-end-game.component.html'
})
export class CrosswordEndGameComponent {
    constructor(
        public configurationService: CrosswordConfigurationService,
        public gameService: CrosswordGameManagerService
    ) { }
}
