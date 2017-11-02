import {Player} from './player'
export class Game {
        id: string = '';
        difficulty: string = '';
        mode: string = '';
        option: string = '';
        player1 : Player;
        player2 : Player;
        
        crossword: string[][] = [[]];
        listOfWords: string[] = [];
               
            constructor(id: string, difficulty: string, mode: string, player1: Player, player2: Player, crossword: string[][], listOfWords: [string] ) {
                this.id = id;
                this.difficulty = difficulty;
                this.player1 = player1;
                this.player2 =  player2;
                this.crossword = crossword;
                this.listOfWords = listOfWords;
            }      
        }