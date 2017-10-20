import { Injectable } from '@angular/core';
@Injectable()
export class CrosswordService {
    constructor() { }
     /***********************************************************
    * Returns the indexes of a given word in a row of the grid. Returns
    * emtpy array if it is not in the grid.
    ************************************************************/
    public findWordIndexesRow(word: string, gridPart: string[], columnOrRowIndex: number): Index[] {

                const indexes: Index[] = [];

                for (let k = 0; k < gridPart.length && indexes.length !== word.length; k++) {
                    if (gridPart[k] === word[indexes.length]) {

                        indexes.push({ i: columnOrRowIndex, j: k });

                    } else {
                        indexes.splice(0, indexes.length);
                    }
                }
                /*test for two special condions firt before returning
                1. the first letter of the word is the last letter of the given column or row
                2. make sure the word we found is not actually part of a larger word eg : cat could be found in catastrophic*/
                if (indexes.length < word.length || (indexes[0].j !== 0 && (gridPart[indexes[0].j - 1] !== ' ' &&
                    gridPart[indexes[0].j - 1] !== '#' )) ||
                    (indexes[indexes.length - 1].j !== gridPart.length - 1 &&
                    (gridPart[indexes[indexes.length - 1].j + 1] !== ' ' && gridPart[indexes[indexes.length - 1].j + 1] !== '#' ) )) {
                    indexes.splice(0, indexes.length);
                }

                return indexes;
            }


            /***********************************************************
             * Returns the indexes of a given word in a column of the grid. Returns
             * emtpy array if it is not in the grid.
             ************************************************************/
            public findWordIndexesColumn(word: string, gridPart: string[], columnOrRowIndex: number): Index[] {

                const indexes: Index[] = [];

                for (let k = 0; k < gridPart.length && indexes.length !== word.length; k++) {
                    if (gridPart[k] === word[indexes.length]) {

                        indexes.push({ i: k, j: columnOrRowIndex });

                    } else {
                        indexes.splice(0, indexes.length);
                    }
                }
                /*test for two special condions firt before returning
                1. the first letter of the word is the last letter of the given column or row
                2. make sure the word we found is not actually part of a larger word eg : cat could be found in catastrophic*/
                if (indexes.length < word.length || (indexes[0].i !== 0 &&
                    (gridPart[indexes[0].i - 1] !== '0' && gridPart[indexes[0].i - 1] !== '#')) ||
                    (indexes[indexes.length - 1].i !== gridPart.length - 1 &&
                   (gridPart[indexes[indexes.length - 1].i + 1] !== '0' && gridPart[indexes[indexes.length - 1].i + 1] !== '#' ))) {
                    indexes.splice(0, indexes.length);
                }

                return indexes;
            }

  /***********************************************************
    * This function fills up the wordIndexes data structure.
    * For every word in the list of words it associates:
    * a list of each index in the grid where a letter of the word is located
    * a positon which states if the word is vertical or horizontal
    * the hint associated with the word.
    ************************************************************/
    public getWordsIndexes(rawCrossword: string[][], listOfWords: string[]):
     Promise<{ word: string, indexes: Index[], position: string, hint: string }[]> {
        const wordsIndexes: { word: string, indexes: Index[], position: string, hint: string }[] = [];
        for (let k = 0; k < listOfWords.length; k++) {
            // check for rows first;
            for (let p = 0; p < rawCrossword.length; p++) {

                // get word indexes for a given row. Will return empty if not present in that row

                let indexes: Index[] = this.findWordIndexesRow
                    (listOfWords[k], rawCrossword[p], p);

                if (indexes.length !== 0) {
                        wordsIndexes.push({
                        word: listOfWords[k], indexes: indexes,
                        position: 'horizontal', hint: ''
                    });
                    break;

                } else {
                    // try in column of given index
                    indexes = this.findWordIndexesColumn
                        (listOfWords[k], this.getColumn(p, rawCrossword), p);

                    if (indexes.length !== 0) {
                           wordsIndexes.push({
                            word: listOfWords[k], indexes: indexes,
                            position: 'vertical', hint: ''
                        });
                        break;
                    }
                }
            }

        }
        return Promise.resolve(wordsIndexes);
    }

    /***********************************************************
    * Return the column of the crossword grid at the given index
    ************************************************************/
    public getColumn(index: number, rawCrossword: string[][]): string[] {

                const column: string[] = [];
                for (let i = 0; i < rawCrossword[0].length; i++) {
                    column.push(rawCrossword[i][index]);
                }
                return column;
            }

}

/***********************************************************
* Interface used for the positon of a crossword grid
***************************************************************/
interface Index {
    i: number;
    j: number;
}
