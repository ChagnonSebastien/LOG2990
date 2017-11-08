import { Component } from '@angular/core';

import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';

@Component({
    selector: 'app-crossword-end-game',
    templateUrl: './crossword-end-game.component.html',
    styleUrls: ['./crossword-end-game.component.css']
})
export class CrosswordEndGameComponent {
    constructor(private configurationService: CrosswordConfigurationService) { }
}
