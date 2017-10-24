import { Component, OnChanges, Input, Output } from '@angular/core';
import { LexiconService } from './lexicon.service';

import { Hint } from './hint';
import { Word } from '../../../../commun/word';

@Component({
    selector: 'app-crossword-hints',
    templateUrl: './crossword-hints.component.html',
    styleUrls: ['./crossword-hints.component.css']
})
export class CrosswordHintsComponent implements OnChanges {
    @Input() public words: Array<Word>;
    @Output() public selectedWord: string;
    public hints: Array<Hint>;

    constructor(private lexiconService: LexiconService) { }

    public ngOnChanges() {
        this.hints = new Array<Hint>();
        for (const word of this.words) {
            this.lexiconService.getWordDefinition(word.word)
                .catch((err) => {
                    this.handleError(err);
                })
                .then((definition) => {
                    this.hints.push(new Hint(word.word, definition));
                });
        }
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
