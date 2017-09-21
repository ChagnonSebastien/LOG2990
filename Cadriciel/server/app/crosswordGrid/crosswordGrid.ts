import * as Tuple from 'typescript';

export class CrosswordGrid {

    public gridSize: number;
    public availableSquares: Array<[number, number]>;
    public lines: string[];
    public grid: Array<string[]>

    constructor(gridSize: number) {
        this.gridSize = gridSize;
        this.availableSquares = [];
        this.grid = [];
    
        for(let i:number = 0 ; i< this.gridSize; i++) {
            for(let j:number = 0; j< this.gridSize; j++ ){
                this.availableSquares.push([i,j]);
            }
        }

        this.resetGrid(); 
    }

        /*def resetGrid(self):
        self.lines = []        
        self.grid = [ [' ' for j in range(self.gridSize)] for i in range(self.gridSize) ]
        shuffle(self.availableSquares)
        self.availableSquares = self.availableSquares[20:]*/

    public resetGrid() {
        this.lines = [];
        
        for(let i:number = 0 ; i< this.gridSize; i++) {
            this.grid[i] = [];
            for(let j:number = 0; j< this.gridSize; j++ ){
                this.grid[i][j] = ' ';
            }
        }
    }
        /*     def addLetter(self, letter, line, column):
        self.grid[line][column] = letter*/

    public addLetter(letter:string, line:number, column:number)  {
        if(line < 10 && column < 10){
            this.grid[line][column] = letter;
        }
    }

    /*     def addWord(self, word, line, column, direction):
        for character in word:
            self.addLetter(character, line, column)
            if direction == 'horizontal':
                column += 1
            elif direction == 'vertical':
                line += 1 */
    
    public addWord(word:string, line:number, column:number, direction:string){
        if((direction === 'horizontal' && this.gridSize >= (column + word.length)) || (direction === 'vertical' && this.gridSize >= (line + word.length))){
            for(let char of word){
                this.addLetter(char, line, column);
                if(direction === 'horizontal'){
                    column++;
                }

                else if(direction === 'vertical'){
                    line++;
                }
            }
        }
    }

    /*    def addBlackSquare(self, line, column):
        self.addLetter('#', line, column)*/

    public addBlackSquare(line:number, column:number){
        this.addLetter('#', line, column);
    }

    /*     def erase(self, line, column):
        self.grid[line][column] = ' ' */


}