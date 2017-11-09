import { Component } from '@angular/core';
import { CrosswordGameManagerService } from './game-manager/crossword-game-manager.service';
import { CrosswordConfigurationService } from './configuration/crossword-configuration.service';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent {
    constructor(
        public crosswordGameService: CrosswordGameManagerService,
        public configurationService: CrosswordConfigurationService,
    ) { }
}

