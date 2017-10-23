import { Component, OnInit } from '@angular/core';
import { CrosswordService } from './crossword.service';
import { Crossword } from './crossword';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent implements OnInit {
    public crossword: Crossword;
    private keydown: boolean;

    constructor(private crosswordService: CrosswordService) { }

    public ngOnInit() {
        this.crosswordService.getCrossword('easy').then((crossword) => {
            this.crossword = new Crossword(
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
        if (this.isLetter(charCode)) {
            this.crossword.checkIfCorrectLetter(charCode, i, j);
        } else if (this.isBackspace(charCode)) {
            this.crossword.eraseLetter(i, j);
        } else {
            this.disableEvent(event);
        }
    }

    private isLetter(keyCode: number) {
        return keyCode >= 65 && keyCode <= 90
            || keyCode >= 97 && keyCode <= 122;
    }

    private isBackspace(keycode: number) {
        return keycode === 8;
    }
}
