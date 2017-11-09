import { TestBed } from '@angular/core/testing';

import { CrosswordGridService } from './crossword-grid.service';
import { KeyboardService } from '../keyboard/keyboard.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';

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
                KeyboardService,
                CrosswordConfigurationService
            ]
        });
        gridService = TestBed.get(CrosswordGridService);
    });

    it('should construct', () => {
        expect(gridService).toBeDefined();
    });

    describe('initialize()', () => {
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

    describe('unselectWord()', () => {
        it('should unselect a word', () => {
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

    describe('selectWord()', () => {
        it('should select a word', () => {
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
    });

    describe('updateWordFoundStatus()', () => {
        beforeEach(() => {
            gridService.newGame(grid, wordsWithIndex);
        });

        it('should mark word as found once all inputs match the answer', () => {
            const rat = wordsWithIndex[4];
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // found 1 letter
            gridService.grid[0][7].input = gridService.grid[0][7].answer;
            gridService.updateWordFoundStatus(rat);
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // found 2 letters
            gridService.grid[0][8].input = gridService.grid[0][8].answer;
            gridService.updateWordFoundStatus(rat);
            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // found all letters
            gridService.grid[0][9].input = gridService.grid[0][9].answer;
            gridService.updateWordFoundStatus(rat);
            // word 'rat' found
            expect(gridService.grid[0][7].found).toBeTruthy();
            expect(gridService.grid[0][8].found).toBeTruthy();
            expect(gridService.grid[0][9].found).toBeTruthy();
        });

        it('should unselect word once it is found', () => {
            const rat = wordsWithIndex[4];

            // select the word rat
            gridService.grid[0][7].selected = true;
            gridService.grid[0][8].selected = true;
            gridService.grid[0][9].selected = true;

            // word 'rat' not found
            expect(gridService.grid[0][7].found).toBeFalsy();
            expect(gridService.grid[0][8].found).toBeFalsy();
            expect(gridService.grid[0][9].found).toBeFalsy();

            // word 'rat selected
            expect(gridService.grid[0][7].selected).toBeTruthy();
            expect(gridService.grid[0][8].selected).toBeTruthy();
            expect(gridService.grid[0][9].selected).toBeTruthy();

            // input correct letters
            gridService.grid[0][7].input = gridService.grid[0][7].answer;
            gridService.grid[0][8].input = gridService.grid[0][8].answer;
            gridService.grid[0][9].input = gridService.grid[0][9].answer;
            gridService.updateWordFoundStatus(rat);

            // word 'rat' found
            expect(gridService.grid[0][7].found).toBeTruthy();
            expect(gridService.grid[0][8].found).toBeTruthy();
            expect(gridService.grid[0][9].found).toBeTruthy();

            // word 'rat' unselected
            expect(gridService.grid[0][7].selected).toBeFalsy();
            expect(gridService.grid[0][8].selected).toBeFalsy();
            expect(gridService.grid[0][9].selected).toBeFalsy();
        });
    });
});
