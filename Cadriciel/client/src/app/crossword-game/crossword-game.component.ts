import { Component, OnInit } from '@angular/core';
import { CrosswordService } from './crossword.service';
import { KeyboardService } from './keyboard.service';

import { CrosswordGame } from './crossword-game';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent implements OnInit {
    public crossword: CrosswordGame;

    constructor(
        private crosswordService: CrosswordService,
        private keyboardService: KeyboardService
    ) { }

    public ngOnInit() {
        this.crosswordService.getCrossword('easy').then((crossword) => {
            this.crossword = new CrosswordGame(
                crossword.crossword,
                crossword.wordsWithIndex,
                crossword.listOfWords
            );
        });
    }

    private disableEvent(event: any): void {
        event.preventDefault();
        event.returnValue = false;
    }

    public handleInput(event: KeyboardEvent, i: number, j: number): void {
        const charCode = event.which || event.keyCode;
        if (this.keyboardService.isLetter(charCode)) {
            this.crossword.insertLetter(charCode, i, j);
        } else if (this.keyboardService.isBackspace(charCode)) {
            this.crossword.eraseLetter(i, j);
        } else if (!this.validInputs(charCode)) {
            this.disableEvent(event);
        }
    }

    private validInputs(keyCode: number): boolean {
        return this.keyboardService.isTab(keyCode)
            || this.keyboardService.isArrowKey(keyCode);
    }
}
