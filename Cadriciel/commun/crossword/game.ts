import {Player} from './player';
import { CrosswordDB } from '../../server/app/crosswordGrid/crosswordDB';
export class Game {
        public id: string = '';
        public difficulty: string = '';
        public mode: string = '';
        public option: string = '';
        public player1 : Player;
        public player2 : Player;  
        public crossword: CrosswordDB;
               
            constructor(id: string, difficulty: string, mode: string, player1: Player, player2: Player, crossword: CrosswordDB ) {
                this.id = id;
                this.difficulty = difficulty;
                this.player1 = player1;
                this.player2 =  player2;
                this.crossword = crossword;
            }      
        }