import {Player} from './player';
import { CrosswordDB } from '../../server/app/crosswordGrid/crosswordDB';
export class Game {
        public id: string;
        public difficulty: string;
        public mode: string;
        public option: string;
        public player1 : Player;
        public player2 : Player;  
        public crossword: CrosswordDB;
               
            constructor( ) {
                this.id = '-1';
                this.difficulty = '';
                this.mode = '';
                this.option = 'solo';
                this.player1 = new Player();
                this.player2 =  new Player();
                
            }      
        }