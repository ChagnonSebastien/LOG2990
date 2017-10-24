import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { LexiconService } from './lexicon.service';

import { Hint } from './hint';
import { Word } from '../../../../commun/word';

@Component({
    selector: 'app-crossword-hints',
    templateUrl: './crossword-hints.component.html',
    styleUrls: ['./crossword-hints.component.css']
})
export class CrosswordHintsComponent {
    public selectedWord: string;
    @Output() private selectedWordChanged: EventEmitter<string> = new EventEmitter<string>();
    @Input() public hints: Array<Hint>;

    constructor(private lexiconService: LexiconService) { }

    public selectWord(word: string) {
        this.selectedWord = word;
        this.selectedWordChanged.emit(word);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
