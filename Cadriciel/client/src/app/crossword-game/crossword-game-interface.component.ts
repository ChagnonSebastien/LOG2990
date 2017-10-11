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
    public wordsIndexes: { word: string, indexes: Index[], position: string, hint: string }[] = [];
    public activeIndexes: Index[] = [];
    public correctIndexes: Index[] = [];
    public kSelected = -1;
    public cheatMode = false;
    public difficulty: string;
    public dataAvailable = false;

    /***********************************************************
    * This function sets the raw crossword
    ************************************************************/
    public setRawCrossword(): void {
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
    public async setDefinitions(): Promise< { word: string, indexes: Index[], position: string, hint: string }[]> {
       for (let i = 0; i < this.crossword.listOfWords.length; i++) {
            await this.lexiconService.getWordDefinition(this.crossword.listOfWords[i], this.difficulty).then(res => {
            this.wordsIndexes[i].hint = res;
           });
        }
    return await this.wordsIndexes;
 }

    public async getWordsIndexes(): Promise< {word: string, indexes: Index[], position: string, hint: string }[]> {
        await this.crosswordService.getWordsIndexes(this.crossword).then(res => {
            for (let i = 0 ; i < res.length ; i ++) {
             this.wordsIndexes.push(res[i]);
          }
        });
        return await this.wordsIndexes;
    }

    /**************************************************************
    * Used to get the crossword from the server by using the
    * the crossword service.
    ***************************************************************/
    public async getCrossword(): Promise<{rawCrossword: [[string]], listOfWords: [string]}> {
        const level: string = this.difficulty.toLowerCase();
        await this.crosswordService.getCrossword(level).then(res => {
            this.crossword = {rawCrossword: res.crossword , listOfWords : res.listOfWords};
           });
           return await this.crossword;
       }

       public async getDifficulty(): Promise<string> {
        await this.crosswordGameInfoService.getLevel().then(level => this.difficulty = level);
        return await this.difficulty;

    }
    constructor(private lexiconService: LexiconService, private crosswordGameInfoService: CrosswordGameInfoService,
                private crosswordService: CrosswordService ) { }

    public ngOnInit() {
        this.getDifficulty().then(res => {
            this.getCrossword().then(response => {
                this.getWordsIndexes().then(indexes => {
                this.setDefinitions().then(data => {
                    this.dataAvailable = true;
                });
              });
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

