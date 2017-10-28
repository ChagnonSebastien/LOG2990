import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CrosswordHintsService } from './crossword-hints.service';

import { Hint } from './hint';

@Component({
    selector: 'app-crossword-hints',
    templateUrl: './crossword-hints.component.html',
    styleUrls: ['./crossword-hints.component.css']
})
export class CrosswordHintsComponent {
    @Output() private selectedWordChanged: EventEmitter<string> = new EventEmitter<string>();
    @Input() public hints: Array<Hint>;
    @Input() public foundWords: Set<string>;
    public cheatMode: boolean;

    constructor(public hintsService: CrosswordHintsService) {
        this.cheatMode = false;
     }

    public selectWord(word: string) {
        this.hintsService.selectWord(word);
        this.selectedWordChanged.emit(word);
    }

    public toggleCheatMode() {
        this.cheatMode = !this.cheatMode;
    }
}
