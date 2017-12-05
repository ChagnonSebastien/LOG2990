import { Component } from '@angular/core';

import { CrosswordCheatService } from './crossword-cheat.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';

@Component({
    selector: 'app-crossword-cheat',
    templateUrl: './crossword-cheat.component.html'
})
export class CrosswordCheatComponent {
    constructor(
        public cheatService: CrosswordCheatService,
        public configurationService: CrosswordConfigurationService
    ) { }
}
