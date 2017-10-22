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
    public gridStatus: SquareStatus[][];

    constructor(private crosswordService: CrosswordService) { }

    public ngOnInit() {
        this.crosswordService.getCrossword('easy').then((crossword) => {
            this.crossword = new Crossword(
                crossword.crossword,
                crossword.wordsWithIndex,
                crossword.listOfWords
            );

            this.gridStatus = crossword.crossword.map((row) => {
                return row.map((square) => {
                    return new SquareStatus(square);
                });
            });
        });
    }
}

class SquareStatus {
    public black: boolean;
    public empty: boolean;
    public found: boolean;
    public selected: boolean;
    public player1Selected: boolean;
    public player2Selected: boolean;

    constructor(character: string) {
        this.black = character === ' ' || character === '#';
        this.empty = !this.black;
        this.found = false;
        this.selected = false;
        this.player1Selected = false;
        this.player2Selected = false;
    }
}
