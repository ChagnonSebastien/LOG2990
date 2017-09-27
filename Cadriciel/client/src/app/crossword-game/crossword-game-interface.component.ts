import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crossword-game-interface',
    templateUrl: './crossword-game-interface.component.html',
    styleUrls: ['./crossword-game-interface.component.css']
})
export class CrosswordGameInterfaceComponent implements OnInit {
    public rawCrossword: [[string]] = [['0', '0', '0', '0', 'p', '0', '0', '0', '0', '0'],
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

    public listOfWordsAndHints: [{word: string, indice: string}] = [{word: 'pune', indice : 'Education Hub' },
    {word: 'bangalore', indice : 'Information Technology Hub'}, {word: 'hyderabad', indice : 'Cultural Hub'},
    {word: 'delhi', indice : 'Capital of India'}, {word: 'mumbai', indice : 'India financial capital'},
    {word: 'kashmir', indice : 'Saffron region'} ];

    public wordsIndexes: {word: string, indexes: Index[], position: string, hint: string}[] = [];
    public activeIndexes: Index[]= [];

    public handleClick(k) {
          this.activeIndexes = this.wordsIndexes[k].indexes;
        }

    public isActive(i, j): boolean {

       for (let k = 0 ; k < this.activeIndexes.length ; k++) {
            if (this.activeIndexes[k].i === i && this.activeIndexes[k].j === j ) {
                return true;
            }
       }
       return false;
     }

     public fillWordsIndexes() {

        for (let k = 0 ; k < this.listOfWordsAndHints.length ; k++ ) {

            // check for rows first

            for (let l = 0 ; l < this.rawCrossword.length ; l++ ) {

                // get word indexes for a given row. Will return empty if not present in that row

                let indexes: Index[] = this.findWordIndexes
                (this.listOfWordsAndHints[k].word, this.rawCrossword[l], l, true);

                if (indexes.length !== 0) {
                    this.wordsIndexes.push({word: this.listOfWordsAndHints[k].word, indexes: indexes,
                     position: 'horizontal', hint: this.listOfWordsAndHints[k].indice});
                    break;

            } else {

                // try in column of given index

                indexes = this.findWordIndexes
                (this.listOfWordsAndHints[k].word, this.getColumn(l), l, false);

                if (indexes.length !== 0) {
                    this.wordsIndexes.push({word: this.listOfWordsAndHints[k].word, indexes: indexes,
                    position: 'vertical', hint: this.listOfWordsAndHints[k].indice});
                    break;
              }

            }
         }

       }
    }

     // Returns the indexes of a given word if it is contained in a grid column or row
     public findWordIndexes(word: string, gridPart: string[], columnOrRowIndex: number, row: boolean) {

        let indexes : Index[] = [];

        for (let k = 0 ; k < gridPart.length && indexes.length !== word.length ; k++ ) {
            if (gridPart[k] === word[indexes.length]) {

                if (row) {
                    indexes.push({i: columnOrRowIndex, j: k});
                } else {
                     indexes.push({i: k, j: columnOrRowIndex});
                }

            } else {
                indexes.splice(0, indexes.length);
            }
        }
            /*test for two special condions firt before returning
            1. the first letter of the word is the last letter of the given column or row
            2. make sure the word we found is not actually part of a larger word eg : cat could be found in catastrophic*/
            if (indexes.length < word.length) {
            indexes.splice(0, indexes.length);
            }

         return(indexes);
     }

     public getColumn(index: number) {
        let column : string[] = [];

        for ( let i = 0; i < 11; i++) {
            column.push(this.rawCrossword[i][index]);
        }
        return column;
     }

    constructor() { }
    public ngOnInit() {

        this.fillWordsIndexes();
    }

}

interface Index {
    i: number;
    j: number;
}

