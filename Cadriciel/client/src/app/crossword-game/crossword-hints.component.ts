import { Component, OnInit, Input, Output } from '@angular/core';
import { LexiconService } from './lexicon.service';

import { Hint } from './hint';

@Component({
    selector: 'app-crossword-hints',
    templateUrl: './crossword-hints.component.html',
    styleUrls: ['./crossword-hints.component.css']
})
export class CrosswordHintsComponent implements OnInit {
    @Input() public words: Array<string>;
    @Output() public selectedWord: string;
    public hints: Array<Hint>;

    constructor(
    ) { }

    public ngOnInit() {

    }
}
