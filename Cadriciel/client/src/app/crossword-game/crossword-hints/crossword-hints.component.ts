import { Component } from '@angular/core';

import { CrosswordHintsService } from './crossword-hints.service';

@Component({
    selector: 'app-crossword-hints',
    templateUrl: './crossword-hints.component.html',
    styleUrls: ['./crossword-hints.component.css']
})
export class CrosswordHintsComponent {
    public cheatMode: boolean;

    constructor(public hintsService: CrosswordHintsService) {
        this.cheatMode = false;
     }

    public toggleCheatMode() {
        this.cheatMode = !this.cheatMode;
    }
}
