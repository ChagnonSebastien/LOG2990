import { Component, OnInit, HostListener, Input, OnChanges, SimpleChange } from '@angular/core';
import {LexiconService} from './lexicon.service';
import {CrosswordGameInfoService} from './crossword-game-info.service';
import {CrosswordService} from './crossword.service';
@Component({
    selector: 'app-crossword-game-interface',
    templateUrl: './crossword-game-interface.component.html',
    styleUrls: ['./crossword-game-interface.component.css']
})
export class CrosswordGameInterfaceComponent implements OnInit {
    public crossword: {rawCrossword: [[string]], listOfWords: [string]} = {rawCrossword: [['']], listOfWords: ['']};
    // public listOfWords: [string] = ['grip', 'gang', 'satellite', 'minimum', 'guarantee', 'bangles', 'holy', 'tram', 'bible' ];
    public wordsIndexes: { word: string, indexes: Index[], position: string, hint: string }[] = [];
    public activeIndexes: Index[] = [];
    public correctIndexes: Index[] = [];
    public kSelected = -1;
    public cheatMode = false;
    public difficulty: string;

    /***********************************************************
    * This function sets the raw crossword
    ************************************************************/
    public setRawCrossword(): void {
    }

    public async getDifficulty(): Promise<string> {
        this.crosswordGameInfoService.getMode().then(mode => this.difficulty = mode);
        return await this.difficulty;

    }


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
        for (let k = 0; k < this.crossword.listOfWords.length; k++) {

            // check for rows first

            for (let p = 0; p < this.crossword.rawCrossword.length; p++) {

                // get word indexes for a given row. Will return empty if not present in that row

                let indexes: Index[] = this.findWordIndexesRow
                    (this.crossword.listOfWords[k], this.crossword.rawCrossword[p], p);

                if (indexes.length !== 0) {
                    this.wordsIndexes.push({
                        word: this.crossword.listOfWords[k], indexes: indexes,
                        position: 'horizontal', hint: ''
                    });
                    this.setDefinition(this.crossword.listOfWords[k], this.difficulty, this.wordsIndexes.length - 1);
                    break;

                } else {

                    // try in column of given index

                    indexes = this.findWordIndexesColumn
                        (this.crossword.listOfWords[k], this.getColumn(p), p);

                    if (indexes.length !== 0) {
                        this.wordsIndexes.push({
                            word: this.crossword.listOfWords[k], indexes: indexes,
                            position: 'vertical', hint: ''
                        });
                        this.setDefinition(this.crossword.listOfWords[k], this.difficulty, this.wordsIndexes.length - 1);
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

        for (let i = 0; i < this.crossword.rawCrossword[0].length; i++) {
            column.push(this.crossword.rawCrossword[i][index]);
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
        if (this.crossword.rawCrossword[i][j].charCodeAt(0) === keyCode ||
        this.crossword.rawCrossword[i][j].charCodeAt(0) - 32 === keyCode) {
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
    * Used to set the cheat mode variable to on.
    ***************************************************************/
    public activateCheatMode(): void {
        this.cheatMode = true;

    }
   /***********************************************************
    * Used to set the cheat mode variable to off.
    ***************************************************************/
    public deactivateCheatMode(): void {
        this.cheatMode = false;
    }
    /**************************************************************
    * Used to set the definiton of a word in the wordIndexes array.
    ***************************************************************/
    public setDefinition(word: string, difficulty: string, position: number) {
     this.lexiconService.getWordDefinition(word, difficulty).then(res => {
         this.wordsIndexes[position].hint = res;
        });
    }

    /**************************************************************
    * Used to get the crossword from the server by using the
    * the crossword service.
    ***************************************************************/
    public async getCrossword(): Promise<{rawCrossword: [[string]], listOfWords: [string]}> {
        await this.crosswordService.getCrossword('normal').then(res => {
            this.crossword = {rawCrossword: res.crossword , listOfWords : res.listOfWords};
            console.log(res.listOfWords);
            console.log(res.crossword);
           });
           return await this.crossword;
       }

    constructor(private lexiconService: LexiconService, private crosswordGameInfoService: CrosswordGameInfoService,
                private crosswordService: CrosswordService ) { }

    public ngOnInit() {
        this.getDifficulty().then(res => {
            this.getCrossword().then(response => {
                this.fillWordsIndexes();
                console.log(this.wordsIndexes);
            });
           });
    }

}

/***********************************************************
* Interface used for the positon of a crossword grid
***************************************************************/
interface Index {
    i: number;
    j: number;
}

