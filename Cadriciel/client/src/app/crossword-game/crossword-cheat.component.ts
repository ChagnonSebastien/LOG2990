import { Component } from '@angular/core';

import { CrosswordCheatService } from './crossword-cheat.service';
import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';

@Component({
    selector: 'app-crossword-cheat',
    templateUrl: './crossword-cheat.component.html',
    styleUrls: ['./crossword-cheat.component.css']
})
export class CrosswordCheatComponent {
    constructor(
        public cheatService: CrosswordCheatService,
        public configurationService: CrosswordConfigurationService
    ) { }
}
