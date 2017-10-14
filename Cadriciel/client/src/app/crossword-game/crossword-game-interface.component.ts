import { Component, OnInit, HostListener, Input, OnChanges, SimpleChange } from '@angular/core';

@Component({
    selector: 'app-crossword-game-interface',
    templateUrl: './crossword-game-interface.component.html',
    styleUrls: ['./crossword-game-interface.component.css']
})
export class CrosswordGameInterfaceComponent implements OnInit {
    public rawCrossword: [[string]] = [['c', '0', '0', '0', 'p', '0', 'c', 'a', 't', 'e'],
    ['a', '0', '0', '0', 'u', '0', '0', '0', '0', '0'],
    ['t', '0', '0', '0', 'n', '0', 'b', '0', '0', '0'],
    ['0', 'h', 'y', 'd', 'e', 'r', 'a', 'b', 'a', 'd'],
    ['0', '0', '0', '0', '0', '0', 'n', '0', '0', 'e'],
    ['0', '0', '0', '0', '0', '0', 'g', '0', '0', 'l'],
    ['0', '0', 'm', 'u', 'm', 'b', 'a', 'i', '0', 'h'],
    ['0', '0', '0', '0', '0', '0', 'l', '0', '0', 'i'],
    ['0', '0', '0', '0', '0', '0', 'o', '0', '0', '0'],
    ['k', 'a', 's', 'h', 'm', 'i', 'r', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', 'e', '0', '0', '0']];

    // public listOfWords: [String] = ['pune', 'bangalore', 'hyderabad', 'delhi', 'mumbai', 'kashmir' ];
    // public indices: [String] = ['Education Hub', 'Information Technology Hub', 'Cultural Hub', 'Capital of India',
    // 'India financial capital', 'Saffron region'];

    public listOfWordsAndHints: [{ word: string, indice: string }] = [{ word: 'pune', indice: 'Education Hub' },
    { word: 'bangalore', indice: 'Information Technology Hub' }, { word: 'hyderabad', indice: 'Cultural Hub' },
    { word: 'delhi', indice: 'Capital of India' }, { word: 'mumbai', indice: 'India financial capital' },
    { word: 'kashmir', indice: 'Saffron region' }, { word: 'cate', indice: 'A choice of dainty food' },
    { word: 'cat', indice: 'A small domesticated mammal kept as a pet ' }];

    public wordsIndexes: { word: string, indexes: Index[], position: string, hint: string }[] = [];
    public activeIndexes: Index[] = [];
    public correctIndexes: Index[] = [];
    public kSelected = -1;
    public cheatMode = false;



    /***********************************************************
    * This function is called when the user clicks on a input.
    * It ads the index to the list of actives indexes.
    ************************************************************/
    public handleClick($event, indexes: Index[]): void {
        this.activeIndexes = indexes.slice();
        $event.stopPropagation();
    }

    /***********************************************************
     * This function is called to check if a crossword grid is
     * currently  active.
     ************************************************************/
    public isActive(i, j): boolean {

        for (let k = 0; k < this.activeIndexes.length; k++) {
            if (this.activeIndexes[k].i === i && this.activeIndexes[k].j === j) {
                return true;
            }
        }
        return false;
    }

    /***********************************************************
    * This function fills up the wordIndexes data structure.
    * For every word in the list of words it associates:
    * a list of each index in the grid where a letter of the word is located
    * a positon which states if the word is vertical or horizontal
    * the hint associated with the word.
    ************************************************************/
    public fillWordsIndexes(): void {

        for (let k = 0; k < this.listOfWordsAndHints.length; k++) {

            // check for rows first

            for (let p = 0; p < this.rawCrossword.length; p++) {

                // get word indexes for a given row. Will return empty if not present in that row

                let indexes: Index[] = this.findWordIndexesRow
                    (this.listOfWordsAndHints[k].word, this.rawCrossword[p], p);

                if (indexes.length !== 0) {
                    this.wordsIndexes.push({
                        word: this.listOfWordsAndHints[k].word, indexes: indexes,
                        position: 'horizontal', hint: this.listOfWordsAndHints[k].indice
                    });
                    break;

                } else {

                    // try in column of given index

                    indexes = this.findWordIndexesColumn
                        (this.listOfWordsAndHints[k].word, this.getColumn(p), p);

                    if (indexes.length !== 0) {
                        this.wordsIndexes.push({
                            word: this.listOfWordsAndHints[k].word, indexes: indexes,
                            position: 'vertical', hint: this.listOfWordsAndHints[k].indice
                        });
                        break;
                    }

                }
            }

        }
    }

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
        if (indexes.length < word.length || (indexes[0].j !== 0 && gridPart[indexes[0].j - 1] !== '0') ||
            (indexes[indexes.length - 1].j !== gridPart.length - 1 && gridPart[indexes[indexes.length - 1].j + 1] !== '0')) {
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
        if (indexes.length < word.length || (indexes[0].i !== 0 && gridPart[indexes[0].i - 1] !== '0') ||
            (indexes[indexes.length - 1].i !== gridPart.length - 1 && gridPart[indexes[indexes.length - 1].i + 1] !== '0')) {
            indexes.splice(0, indexes.length);
        }

        return indexes;
    }

    /***********************************************************
    * Return the column of the crossword grid at the given index
    ************************************************************/
    public getColumn(index: number): string[] {

        const column: string[] = [];

        for (let i = 0; i < 11; i++) {
            column.push(this.rawCrossword[i][index]);
        }
        return column;
    }

    /***********************************************************
    * This function is used to unselect the selected crossword
    * grids when the user clicks outside the grid
    ************************************************************/
    public cancelSelection($event): void {
        this.activeIndexes.splice(0, this.activeIndexes.length);
        this.kSelected = -1;
    }


    /***********************************************************
    * Cancel the event propagation
    ************************************************************/
    public handleInput(event): void {
        event.stopPropagation();
    }

    /***********************************************************
    * Prevent the user from entering numbers and symbols.
    ************************************************************/
    public filterInput(event: any, i: number, j: number): void {
        const x = event.which || event.keyCode;
        // Check if input is a letter
        if (((x < 65 || x > 122) || (x >= 91 && x <= 96)) && x !== 8) {
            // stop event to prevent entering something else than letters
            this.disableEvent(event);
        } else {
            this.checkIfCorrectInput(x, i, j);
        }
    }

    /***********************************************************
    * This function is used to delete the the correct index
    * when the backspace key is invoked.
    ************************************************************/
    public handleDelete(event, i: number, j: number) {
        const x = event.keyCode || event.which;
        if (x === 8) {
            for (let k = 0; k < this.correctIndexes.length; k++) {
                if (this.correctIndexes[k].i === i && this.correctIndexes[k].j === j) {
                    this.correctIndexes.splice(k, 1);
                }
            }
        }
    }
    /***********************************************************
    * Check if the word was found by the user using its postion
    * in the wordIndexes array
    ***************************************************************/
    public checkWordFound(wordPosition: number): boolean {
        if (wordPosition < this.wordsIndexes.length && wordPosition > -1) {
            for (let i = 0; i < this.wordsIndexes[wordPosition].indexes.length; i++) {
                if (!(this.checkCorrectIndexes(this.wordsIndexes[wordPosition].indexes[i].i,
                    this.wordsIndexes[wordPosition].indexes[i].j))) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /***********************************************************
    * Using the index of a grid , check if the words containing
    * that index were found.
    ***************************************************************/
    public checkWordWithIndex(i: number, j: number): boolean {

        for (let k = 0; k < this.wordsIndexes.length; k++) {
            for (let l = 0; l < this.wordsIndexes[k].indexes.length; l++) {
                if (this.wordsIndexes[k].indexes[l].i === i && this.wordsIndexes[k].indexes[l].j === j) {
                    if (this.checkWordFound(k)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /***********************************************************
    *Check if  the letter enterted at this particular index
    *contains the correct letter
    ***************************************************************/
    public checkCorrectIndexes(i: number, j: number): boolean {
        let found = false;

        for (let k = 0; k < this.correctIndexes.length; k++) {
            if (this.correctIndexes[k].i === i && this.correctIndexes[k].j === j) {
                found = true;
            }
        }
        return found;
    }

    /***********************************************************
    *Set the variable kSelected which represents the positon of
    *the selected word in the wordIndexes table
    ***************************************************************/
    public selectK(k): void {
        this.kSelected = k;
    }


    /***********************************************************
    *Check if the word positon is vertical
    ***************************************************************/
    public checkVertical(position: string): boolean {

        return position === 'vertical';

    }

    /***********************************************************
    *Check if the word positon is horizontal
    ***************************************************************/
    public checkHorizontal(position: string): boolean {

        return position === 'horizontal';

    }


    /***********************************************************
    *Disable the event
    ***************************************************************/
    public disableEvent(event: any): void {
        event.preventDefault();
        event.returnValue = false;
    }

    /***********************************************************
    *Check if the user input matches the crossword grid. If so add
    * it to the correct indexes lisr
    ***************************************************************/
    public checkIfCorrectInput(keyCode: number, i: number, j: number): void {
        if (this.rawCrossword[i][j].charCodeAt(0) === keyCode || this.rawCrossword[i][j].charCodeAt(0) - 32 === keyCode) {
            const index: Index = { i: i, j: j };
            this.correctIndexes.push(index);
        } else {
            for (let k = 0; k < this.correctIndexes.length; k++) {
                if (this.correctIndexes[k].i === i && this.correctIndexes[k].j === j) {
                    this.correctIndexes.splice(k, 1);
                }
            }
        }
    }

    /***********************************************************
    * Used to set the cheat mode variable to on
    ***************************************************************/
    public activateCheatMode(): void {
        this.cheatMode = true;

    }
    /***********************************************************
     * Used to set the cheat mode variable to off
     ***************************************************************/
    public deactivateCheatMode(): void {
        this.cheatMode = false;
    }

    constructor() { }

    public ngOnInit() {
        this.fillWordsIndexes();
    }

}

/***********************************************************
* Interface used for the positon of a crossword grid
***************************************************************/
interface Index {
    i: number;
    j: number;
}

