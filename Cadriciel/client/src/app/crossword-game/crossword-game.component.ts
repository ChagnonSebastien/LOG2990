import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css'],
})
export class CrosswordGameComponent implements OnInit {
    public grid: string[][] = [
        ['a', 'p', 'p', 'e', 'a', 'l', '#', 'r', 'a', 't'],
        ['#', ' ', ' ', '#', ' ', ' ', ' ', 'i', ' ', 'e'],
        ['s', '#', 'a', 'p', 'p', 'e', 'n', 'd', 'i', 'x'],
        ['t', ' ', ' ', 'r', ' ', ' ', '#', 'e', ' ', 't'],
        ['a', '#', 'w', 'a', 'r', '#', 'p', '#', ' ', 'b'],
        ['f', ' ', ' ', 'c', '#', 'r', 'a', 'd', 'i', 'o'],
        ['f', 'i', 's', 't', '#', ' ', 's', ' ', ' ', 'o'],
        ['#', ' ', ' ', 'i', ' ', ' ', '#', ' ', ' ', 'k'],
        ['f', 'l', 'i', 'c', 'k', '#', ' ', ' ', ' ', '#'],
        [' ', ' ', ' ', 'e', ' ', ' ', ' ', ' ', ' ', ' ']
    ];

    public gridStatus: SquareStatus[][];

    public ngOnInit() {
        this.gridStatus = this.grid.map((row) => {
            return row.map((square) => {
                return new SquareStatus(square);
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
    }
}
