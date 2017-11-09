import { TestBed } from '@angular/core/testing';

import { CrosswordGridService } from './crossword-grid.service';
import { KeyboardService } from '../keyboard/keyboard.service';

let gridService: CrosswordGridService;

const grid = [
    ['a', 'p', 'p', 'e', 'a', 'l', '#', 'r', 'a', 't'],
    ['#', ' ', ' ', '#', ' ', ' ', ' ', 'i', ' ', 'e'],
    ['s', '#', 'a', 'p', 'p', 'e', 'n', 'd', 'i', 'x'],
    ['t', ' ', ' ', 'r', ' ', ' ', '#', 'e', ' ', 't'],
    ['a', '#', 'w', 'a', 'r', '#', 'p', '#', ' ', 'b'],
    ['f', ' ', ' ', 'c', '#', 'r', 'a', 'd', 'i', 'o'],
    ['f', 'i', 's', 't', '#', ' ', 's', ' ', ' ', 'o'],
    ['#', ' ', ' ', 'i', ' ', ' ', '#', ' ', ' ', 'k'],
    ['f', 'l', 'i', 'c', 'k', '#', ' ', ' ', ' ', '#'],
    [' ', ' ', ' ', 'e', ' ', ' ', ' ', ' ', ' ', ' ']
];

const wordsWithIndex = [
    { 'i': 0, 'j': 0, 'word': 'appeal', 'horizontal': true },
    { 'i': 0, 'j': 9, 'word': 'textbook', 'horizontal': false },
    { 'i': 2, 'j': 2, 'word': 'appendix', 'horizontal': true },
    { 'i': 0, 'j': 7, 'word': 'ride', 'horizontal': false },
    { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true },
    { 'i': 5, 'j': 5, 'word': 'radio', 'horizontal': true },
    { 'i': 4, 'j': 6, 'word': 'pas', 'horizontal': false },
    { 'i': 2, 'j': 3, 'word': 'practice', 'horizontal': false },
    { 'i': 4, 'j': 2, 'word': 'war', 'horizontal': true },
    { 'i': 6, 'j': 0, 'word': 'fist', 'horizontal': true },
    { 'i': 8, 'j': 0, 'word': 'flick', 'horizontal': true },
    { 'i': 2, 'j': 0, 'word': 'staff', 'horizontal': false }
];

describe('#CrosswordGridService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordGridService,
                KeyboardService
            ]
        });
        gridService = TestBed.get(CrosswordGridService);
    });

    it('should construct', () => {
        expect(gridService).toBeDefined();
    });

    describe('newGame()', () => {
        describe('construction', () => {
            it('should initialize the grid of CrosswordSquares', () => {
                expect(gridService.grid).toBeUndefined();
                gridService.newGame(grid, wordsWithIndex);
                expect(gridService.grid).toBeDefined();
            });
        });

        describe('behaviour', () => {
            beforeEach(() => {
                gridService.newGame(grid, wordsWithIndex);
            });

            it('should initialize the answers of the grid', () => {
                gridService.grid.map((row, i) => {
                    row.map((square, j) => {
                        expect(square.answer).toEqual(grid[i][j]);
                    });
                });
            });

            it('should initialize the words contributing to each index', () => {
                expect(gridService.grid[1][0].words.length).toEqual(0);

                expect(gridService.grid[0][0].words.length).toEqual(1);
                gridService.grid[0][0].words.map((word) => {
                    expect(word.word).toEqual('appeal');
                });

                expect(gridService.grid[0][9].words.length).toEqual(2);
                gridService.grid[0][9].words.map((word) => {
                    expect(['rat', 'textbook']).toContain(word.word);
                });
            });

            it('should identify empty squares', () => {
                expect(gridService.grid[0][0].empty).toBeTruthy();
                expect(gridService.grid[1][0].empty).toBeFalsy();
            });

            it('should identify black squares as # or " "', () => {
                expect(gridService.grid[0][0].black).toBeFalsy();
                expect(gridService.grid[1][0].black).toBeTruthy();
                expect(gridService.grid[1][1].black).toBeTruthy();
            });

            it('should have no initial input on empty squares', () => {
                expect(gridService.grid[0][0].empty).toBeTruthy();
                expect(gridService.grid[0][0].input).toEqual('');
            });

            it('should not select anything at initialization', () => {
                for (const row of gridService.grid) {
                    for (const square of row) {
                        expect(square.selected).toBeFalsy();
                    }
                }
            });
        });
    });

    describe('wordFoundAlerts()', () => {
        it('should alert when a found is found', (done) => {
            gridService.wordFoundAlerts().subscribe((word) => {
                expect(word).toBeDefined();
                expect(word).toEqual(wordsWithIndex[0]);
                done();
            });
            gridService['wordFoundSubject'].next(wordsWithIndex[0]);
        });
    });

    describe('unselectWord()', () => {
        it('should unselect all words', () => {
            gridService.newGame(grid, wordsWithIndex);

            // select the word rat
            gridService.grid[0][7].selected = true;
            gridService.grid[0][8].selected = true;
            gridService.grid[0][9].selected = true;

            gridService.unselectWord();

            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();
        });
    });

    describe('unselectWordOpponent()', () => {
        it('should unselect all words selected by the opponent', () => {
            gridService.newGame(grid, wordsWithIndex);

            // opponent selects the word rat
            gridService.grid[0][7].opponentSelected = true;
            gridService.grid[0][8].opponentSelected = true;
            gridService.grid[0][9].opponentSelected = true;

            gridService.unselectWordOpponent();

            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();
        });
    });

    describe('selectWord()', () => {
        it('should mark a word as selected by the opponent', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat unselected
            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();

            gridService.selectWord(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].selected).toBeTruthy();
            expect(gridService.grid[0][8].selected).toBeTruthy();
            expect(gridService.grid[0][9].selected).toBeTruthy();
        });

        it('should not select a word that is already found by yourself', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat unselected by you
            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();

            // rat found
            gridService.grid[0][7].found = true;
            gridService.grid[0][8].found = true;
            gridService.grid[0][9].found = true;

            gridService.selectWord(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();
        });

        it('should not select a word that is already found by the opponent', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat unselected by you
            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();

            // rat found by opponent
            gridService.grid[0][7].opponentFound = true;
            gridService.grid[0][8].opponentFound = true;
            gridService.grid[0][9].opponentFound = true;

            gridService.selectWord(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();
        });
    });

    describe('selectWordOpponent()', () => {
        it('should select a word', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat unselected by opponent
            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();

            gridService.selectWordOpponent(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].opponentSelected).toBeTruthy();
            expect(gridService.grid[0][8].opponentSelected).toBeTruthy();
            expect(gridService.grid[0][9].opponentSelected).toBeTruthy();
        });

        it('should not select a word that is already found by yourself', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat unselected by opponent
            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();

            // rat found by you
            gridService.grid[0][7].found = true;
            gridService.grid[0][8].found = true;
            gridService.grid[0][9].found = true;

            gridService.selectWordOpponent(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();
        });

        it('should not select a word that is already found by the opponent', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat unselected by opponent
            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();

            // rat found by opponent
            gridService.grid[0][7].opponentFound = true;
            gridService.grid[0][8].opponentFound = true;
            gridService.grid[0][9].opponentFound = true;

            gridService.selectWordOpponent(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();
        });
    });

    describe('markWordAsFoundByOpponent', () => {
        it('should mark a word as found by the opponent', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat not found by opponent
            expect(gridService.grid[0][7].opponentFound).toBeFalsy();
            expect(gridService.grid[0][8].opponentFound).toBeFalsy();
            expect(gridService.grid[0][9].opponentFound).toBeFalsy();

            gridService.markWordAsFoundByOpponent(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].opponentFound).toBeTruthy();
            expect(gridService.grid[0][8].opponentFound).toBeTruthy();
            expect(gridService.grid[0][9].opponentFound).toBeTruthy();
        });

        it('should unselect the word found by the opponent', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat not found by opponent
            expect(gridService.grid[0][7].opponentFound).toBeFalsy();
            expect(gridService.grid[0][8].opponentFound).toBeFalsy();
            expect(gridService.grid[0][9].opponentFound).toBeFalsy();

            gridService.markWordAsFoundByOpponent(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();

            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();
        });

        it('should fill in the correct answers', () => {
            gridService.newGame(grid, wordsWithIndex);

            // rat not found by opponent
            expect(gridService.grid[0][7].opponentFound).toBeFalsy();
            expect(gridService.grid[0][8].opponentFound).toBeFalsy();
            expect(gridService.grid[0][9].opponentFound).toBeFalsy();

            gridService.markWordAsFoundByOpponent(
                { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true }
            );

            expect(gridService.grid[0][7].input).toEqual(gridService.grid[0][7].answer);
            expect(gridService.grid[0][8].input).toEqual(gridService.grid[0][8].answer);
            expect(gridService.grid[0][9].input).toEqual(gridService.grid[0][9].answer);
        });
    });

    describe('input behaviour()', () => {
        beforeEach(() => {
            gridService.newGame(grid, wordsWithIndex);
        });

        it('should mark word as found once all inputs match the answer when selecting the word', () => {
            const rat = wordsWithIndex[4];
            gridService.selectWord(rat);

            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // found 1 letter
            gridService['keyboardService']['letterInputSubject']
                .next({
                    letter: gridService.grid[0][7].answer, i: 0, j: 7
                });
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // found 2 letters
            gridService['keyboardService']['letterInputSubject'].next(
                { letter: gridService.grid[0][8].answer, i: 0, j: 8 }
            );
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // found all letters
            gridService['keyboardService']['letterInputSubject'].next(
                { letter: gridService.grid[0][9].answer, i: 0, j: 9 }
            );
            // word 'rat' found
            expect(gridService.grid[0][7].found).toBeTruthy();
            expect(gridService.grid[0][8].found).toBeTruthy();
            expect(gridService.grid[0][9].found).toBeTruthy();
        });

        it('should not mark word as found when not selecting the word', () => {
            // rat unselected
            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();

            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // input 1st letter
            gridService['keyboardService']['letterInputSubject']
                .next({
                    letter: gridService.grid[0][7].answer, i: 0, j: 7
                });
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // input 2nd letter
            gridService['keyboardService']['letterInputSubject'].next(
                { letter: gridService.grid[0][8].answer, i: 0, j: 8 }
            );
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // input last letter
            gridService['keyboardService']['letterInputSubject'].next(
                { letter: gridService.grid[0][9].answer, i: 0, j: 9 }
            );
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();
        });

        it('should unselect word once it is found', () => {
            const rat = wordsWithIndex[4];

            gridService.selectWord(rat);
            expect(gridService.grid[0][7].selected).toBeTruthy();
            expect(gridService.grid[0][8].selected).toBeTruthy();
            expect(gridService.grid[0][9].selected).toBeTruthy();

            // found 1 letter
            gridService['keyboardService']['letterInputSubject']
                .next({
                    letter: gridService.grid[0][7].answer, i: 0, j: 7
                });
            // found 2 letters
            gridService['keyboardService']['letterInputSubject'].next(
                { letter: gridService.grid[0][8].answer, i: 0, j: 8 }
            );
            // found all letters
            gridService['keyboardService']['letterInputSubject'].next(
                { letter: gridService.grid[0][9].answer, i: 0, j: 9 }
            );
            // word 'rat' found
            expect(gridService.grid[0][7].found).toBeTruthy();
            expect(gridService.grid[0][8].found).toBeTruthy();
            expect(gridService.grid[0][9].found).toBeTruthy();

            // rat unselected by you
            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();

            // rat unselected by opponent
            expect(gridService.grid[0][7].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][8].opponentSelected).toBeFalsy();
            expect(gridService.grid[0][9].opponentSelected).toBeFalsy();
        });
    });

    describe('backspace behaviour', () => {
        beforeEach(() => {
            gridService.newGame(grid, wordsWithIndex);
        });

        it('should erase a letter when it detects a backspace and it is selected', () => {
            gridService.grid[0][7].input = 'a';
            gridService.grid[0][7].selected = true;

            gridService['keyboardService']['backspaceSubject']
                .next({ i: 0, j: 7 });
            expect(gridService.grid[0][7].input).toEqual('');
        });

        it('should not erase a letter when it detects a backspace and it is selected', () => {
            gridService.grid[0][7].input = 'a';
            gridService.grid[0][7].selected = false;

            gridService['keyboardService']['backspaceSubject']
                .next({ i: 0, j: 7 });
            expect(gridService.grid[0][7].input).not.toEqual('');
        });
    });
});
