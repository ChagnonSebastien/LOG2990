import { CrosswordGrid } from './crosswordGrid';
import { assert } from 'chai';


describe('Crossword Grid', () =>{

    it("Constructor should initialize gridSize to 10", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        assert(crosswordGrid.gridSize == 10);
    })

    it("Constructor should initialize available squares", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        assert(crosswordGrid.availableSquares.length == 100);
    })

    it("Should reset a grid", ()=> {
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.resetGrid();

        assert(crosswordGrid.lines.length === 0);
    })

    it("Should add a letter (a) to the grid by specifying the line(5) and the column(6)", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addLetter('a', 5, 6);
        assert(crosswordGrid.grid[5][6] == 'a');
    })

    it("Should not add a letter (a) when inserting out of bound", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addLetter('a', 10, 15);
        // assert true if an error is not displayed by addLetter method
        assert(true);
    })

    it("Should add the word 'hello' at line 2 column 8 vertically", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addWord('hello', 2, 8, 'vertical');
        assert(crosswordGrid.grid[2][8] === 'h' && crosswordGrid.grid[6][8] === 'o');
    })

    it("Should add the word 'hello' at line 8 column 2 horizontally", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addWord('hello', 8, 2, 'horizontal');
        assert(crosswordGrid.grid[8][2] === 'h' && crosswordGrid.grid[8][6] === 'o');
    })

    it("Should not add the word 'hello' at line 9 column 8 horizontally", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addWord('hello', 9, 8, 'vertical');
        assert(crosswordGrid.grid[9][8] === ' ');
    })

    it("Should  not add the word 'hello' at line 9 column 8 vertically", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addWord('hello', 9, 8, 'horizontal');
        assert(crosswordGrid.grid[9][8] === ' ');
    })

    it("Should add a black square at line 4 column 9", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addBlackSquare(4,8);
        assert(crosswordGrid.grid[4][8] === '#');
    })

    it("Should be able to erase a letter at specified position", ()=>{
        let crosswordGrid = new CrosswordGrid(10);
        crosswordGrid.addBlackSquare(4,8);
        crosswordGrid.erase(4,8);
        assert(crosswordGrid.grid[4][8] === ' ');
    })
})