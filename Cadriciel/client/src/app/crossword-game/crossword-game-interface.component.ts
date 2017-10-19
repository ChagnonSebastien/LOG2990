import { Component, OnInit, HostListener, Input, OnChanges, SimpleChange } from '@angular/core';
import {LexiconService} from './lexicon.service';
import {CrosswordGameInfoService} from './crossword-game-info.service';
import {CrosswordService} from './crossword.service';
import {MultiplayerService} from './crossword-multiplayer.service';
import { Game } from '../../../../commun/crossword/game';
@Component({
    selector: 'app-crossword-game-interface',
    templateUrl: './crossword-game-interface.component.html',
    styleUrls: ['./crossword-game-interface.component.css']
})
export class CrosswordGameInterfaceComponent implements OnInit {
    public wordsIndexes: { word: string, indexes: Index[], position: string, hint: string }[] = [];
    public activeIndexes: Index[] = [];
    public correctIndexes: Index[] = [];
    public kSelected = -1;
    public cheatMode = false;
    public game: Game;
    public dataAvailable = false;

    /***********************************************************
    * This function sets the raw crossword
    ************************************************************/
    public setRawCrossword(): void {
    }

    /***********************************************************
    * This function checks if the online opponent selected a
    * a grid in the crossword.
    ************************************************************/
    public checkIfOpponentSelected(i: number, j: number): boolean {
        return this.multiplayerService.checkIfOpponentSelected(i, j);
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
    * Let the opponent know we selected this hint in multiplayer
    * mode.
    ***************************************************************/
    public awareSelectionOpponent(indexes: Index[]): void {
        this.multiplayerService.selectHint(indexes);
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
        if (this.game.crossword[i][j].charCodeAt(0) === keyCode ||
        this.game.crossword[i][j].charCodeAt(0) - 32 === keyCode) {
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
       for (let i = 0; i < this.game.listOfWords.length; i++) {
            await this.lexiconService.getWordDefinition(this.game.listOfWords[i], this.game.difficulty).then(res => {
            this.wordsIndexes[i].hint = res;
           });
        }
    return await this.wordsIndexes;
 }
    /**************************************************************
    * Used to get the word indexes data stucture.
    ***************************************************************/
    public async getWordsIndexes(): Promise< {word: string, indexes: Index[], position: string, hint: string }[]> {
        await this.crosswordService.getWordsIndexes(this.game.crossword, this.game.listOfWords).then(res => {
            console.log(this.game);
            console.log(this.game.listOfWords);
            console.log(res);
            for (let i = 0 ; i < res.length ; i ++) {
             this.wordsIndexes.push(res[i]);
          }
        });
        return await this.wordsIndexes;
    }
    /**************************************************************
    * Used to get the game object containing the game information.
    ***************************************************************/
       public async getGame(): Promise<Game> {
        await this.crosswordGameInfoService.getGameInfo().then(game => this.game = game);
        return await this.game;

    }
    constructor(private lexiconService: LexiconService, private crosswordGameInfoService: CrosswordGameInfoService,
                private crosswordService: CrosswordService, private multiplayerService: MultiplayerService ) {}

    public ngOnInit() {
        this.getGame().then(game => {
                this.getWordsIndexes().then(indexes => {
                    this.setDefinitions().then(data => {
                    this.dataAvailable = true;
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

