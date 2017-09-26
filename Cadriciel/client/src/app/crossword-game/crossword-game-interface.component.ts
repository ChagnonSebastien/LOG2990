import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crossword-game-interface',
    templateUrl: './crossword-game-interface.component.html',
    styleUrls: ['./crossword-game-interface.component.css']
})
export class CrosswordGameInterfaceComponent implements OnInit {
    public rawCrossword: [[String]] = [['0', '0', '0', '0', 'p', '0', '0', '0', '0', '0'],
                                      ['0', '0', '0', '0', 'u', '0', '0', '0', '0', '0'],
                                      ['0', '0', '0', '0', 'n', '0', 'b', '0', '0', '0'],
                                      ['0', 'h', 'y', 'd', 'e', 'r', 'a', 'b', 'a', 'd'],
                                      ['0', '0', '0', '0', '0', '0', 'n', '0', '0', 'e'],
                                      ['0', '0', '0', '0', '0', '0', 'g', '0', '0', 'l'],
                                      ['0', '0', 'm', 'u', 'm', 'b', 'a', 'i', '0', 'h'],
                                      ['0', '0', '0', '0', '0', '0', 'l', '0', '0', 'i'],
                                      ['0', '0', '0', '0', '0', '0', 'o', '0', '0', '0'],
                                      ['k', 'a', 's', 'h', 'm', 'i', 'r', '0', '0', '0'],
                                      ['0', '0', '0', '0', '0', '0', 'e', '0', '0', '0']];

    // public list0fWords: [String] = ['pune', 'bangalore', 'hyderabad', 'delhi', 'mumbai', 'kashmir' ];
    // public indices: [String] = ['Education Hub', 'Information Technology Hub', 'Cultural Hub', 'Capital of India',
    // 'India financial capital', 'Saffron region'];

    public listOfWordsAndHints: [{word: String, indice: String}] = [{word: 'pune', indice : 'Education Hub' },
    {word: 'banglore', indice : 'Information Technology Hub'}, {word: 'hyderabad', indice : 'Cultural Hub'},
    {word: 'delhi', indice : 'Capital of India'}, {word: 'mumbai', indice : 'India financial capital'},
    {word: 'kashmir', indice : 'Saffron region'} ];
    public wordsIndex: [[String, {i: number, j: number}]];
    public gridSqaures: [{i: number, j: number, isActive: boolean}];
    public activeSquareCoord: {i: number, j: number};
    public handleClick(i, j) {
          this.activeSquareCoord = {
            i: i,
            j: j
        };
    }
    public isActive(i, j): boolean {
       console.log('hello');
        return (i === this.activeSquareCoord.i && j === this.activeSquareCoord.j);
     }

    constructor() { }
    public ngOnInit() {
        // on init set the active as none of the grid squares
        this.activeSquareCoord = {
            i: -1,
            j: -1
        };
    }

}
