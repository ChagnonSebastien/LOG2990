import { Component } from '@angular/core';

import { CrosswordHintsService } from './crossword-hints.service';
import { CrosswordCheatService } from '../cheat/crossword-cheat.service';

@Component({
    selector: 'app-crossword-hints',
    templateUrl: './crossword-hints.component.html',
    styleUrls: ['./crossword-hints.component.css']
})
export class CrosswordHintsComponent {
    constructor(
        public hintsService: CrosswordHintsService,
        public cheatService: CrosswordCheatService
    ) { }
}
