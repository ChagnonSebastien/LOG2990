import { Component } from '@angular/core';

import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { CrosswordGameService } from '../game-manager/crossword-game.service';

@Component({
    selector: 'app-crossword-end-game',
    templateUrl: './crossword-end-game.component.html',
    styleUrls: ['./crossword-end-game.component.css']
})
export class CrosswordEndGameComponent {
    constructor(
        public configurationService: CrosswordConfigurationService,
        public gameService: CrosswordGameService
    ) { }
}
