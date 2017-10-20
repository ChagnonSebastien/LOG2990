export class Game {
        id: string = '';
        difficulty: string = '';
        mode: string = '';
        option: string = '';
        username1: string = '';
        username2: string = '';
        socketId1: string = ''; 
        socketId2: string = '';
        crossword: string[][] = [[]];
        listOfWords: string[] = [];
               
            constructor(id: string, difficulty: string, mode: string, username1: string, username2: string,
                       socketId1: string, socketId2: string, crossword: string[][], listOfWords: [string] ) {
                this.id = id;
                this.difficulty = difficulty;
                this.username1 = username1;
                this.username2 =  username2;
                this.socketId1 = socketId1;
                this.socketId2 =  socketId2;
                this.crossword = crossword;
                this.listOfWords = listOfWords;
            }      
        }