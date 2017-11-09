import { Component } from '@angular/core';

import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';

@Component({
    selector: 'app-crossword-menu',
    templateUrl: './crossword-menu.component.html',
    styleUrls: ['./crossword-menu.component.css'],
})
export class CrosswordMenuComponent {
    constructor(
        private configurationService: CrosswordConfigurationService,
        private playerService: CrosswordPlayerService
    ) { }
}
