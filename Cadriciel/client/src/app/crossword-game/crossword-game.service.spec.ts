import { TestBed } from '@angular/core/testing';

import { HttpModule } from '@angular/http';

import { CrosswordService } from './crossword.service';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';
import { LexiconService } from './lexicon.service';

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

const listOfWords = [
    'appeal',
    'textbook',
    'appendix',
    'ride',
    'rat',
    'radio',
    'pas',
    'practice',
    'war',
    'fist',
    'flick',
    'staff'
];

class MockCrosswordService extends CrosswordService {
    public getCrossword(level: string): Promise<any> {
        return Promise.resolve({
            crossword: grid,
            wordsWithIndex: wordsWithIndex,
            listOfWords: listOfWords
        });
    }
}

class MockLexiconService extends LexiconService {
    public getWordDefinition(word: string): Promise<any> {
        return Promise.resolve('');
    }
}

let crossword: CrosswordGameService;

describe('#CrosswordGame', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CrosswordGameService,
                CrosswordGridService,
                CrosswordHintsService,
                CrosswordPointsService,
                { provide: LexiconService, useClass: MockLexiconService },
                { provide: CrosswordService, useClass: MockCrosswordService }
            ]
        });
        crossword = TestBed.get(CrosswordGameService);
    });

    it('should construct', () => {
        expect(crossword).toBeDefined();
    });

    /*it('should initialize the timer', async () => {
        await crossword.newGame('easy');
        expect(crossword.getTimer()).toBeGreaterThan(0);
    });

    it('should identify empty squares', async () => {
        await crossword.newGame('easy');
        expect(crossword.getStatus()[0][0].empty).toBeTruthy();
        expect(crossword.getStatus()[1][0].empty).toBeFalsy();
    });

    it('should identify black squares as # or " "', async () => {
        await crossword.newGame('easy');
        expect(crossword.getStatus()[0][0].black).toBeFalsy();
        expect(crossword.getStatus()[1][0].black).toBeTruthy();
        expect(crossword.getStatus()[1][1].black).toBeTruthy();
    });

    it('should have no initial input on empty squares', async () => {
        await crossword.newGame('easy');
        expect(crossword.getStatus()[0][0].empty).toBeTruthy();
        expect(crossword.getStatus()[0][0].input).toEqual('');
    });

    it('should initialize wordsWithIndex', async () => {
        await crossword.newGame('easy');
        expect(crossword.wordsWithIndex).toEqual(wordsWithIndex);
    });

    it('should initialize wordMap with all words of the crossword', async () => {
        await crossword.newGame('easy');
        expect(crossword.wordMap.size).toEqual(wordsWithIndex.length);
        for (const word of listOfWords) {
            expect(crossword.wordMap.has(word))
                .toBeTruthy();
        }
    });

    it('nothing should be selected at initialization', async () => {
        await crossword.newGame('easy');
        for (const row of crossword.getStatus()) {
            for (const square of row) {
                expect(square.selected).toBeFalsy();
                expect(square.player1Selected).toBeFalsy();
                expect(square.player2Selected).toBeFalsy();
            }
        }
    });

    describe('insertLetter()', () => {
        it('should insert a letter when the square is empty', async () => {
            await crossword.newGame('easy');
            expect(crossword.getStatus()[0][0].empty).toBeTruthy();
            crossword.insertLetter('A'.charCodeAt(0), 0, 0);
            expect(crossword.getStatus()[0][0].input).toEqual('a');
        });

        it('should not insert a letter when the square is black', async () => {
            await crossword.newGame('easy');
            expect(crossword.getStatus()[1][0].black).toBeTruthy();
            crossword.insertLetter('A'.charCodeAt(0), 1, 0);
            expect(crossword.getStatus()[1][0].input).toEqual('');
        });

        it('should insert the word APPEAL, and it should be marked as correct when the L is inserted', async () => {
            await crossword.newGame('easy');
            crossword.insertLetter('A'.charCodeAt(0), 0, 0);
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].found).toBeFalsy();
            }
            crossword.insertLetter('P'.charCodeAt(0), 0, 1);
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].found).toBeFalsy();
            }
            crossword.insertLetter('P'.charCodeAt(0), 0, 2);
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].found).toBeFalsy();
            }
            crossword.insertLetter('E'.charCodeAt(0), 0, 3);
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].found).toBeFalsy();
            }
            crossword.insertLetter('A'.charCodeAt(0), 0, 4);
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].found).toBeFalsy();
            }
            crossword.insertLetter('L'.charCodeAt(0), 0, 5);
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].found).toBeTruthy();
            }
        });

        it('should prevent inserting letter if the word is found', async () => {
            await crossword.newGame('easy');
            // Insert APPEAL
            crossword.insertLetter('A'.charCodeAt(0), 0, 0);
            crossword.insertLetter('P'.charCodeAt(0), 0, 1);
            crossword.insertLetter('P'.charCodeAt(0), 0, 2);
            crossword.insertLetter('E'.charCodeAt(0), 0, 3);
            crossword.insertLetter('A'.charCodeAt(0), 0, 4);
            crossword.insertLetter('L'.charCodeAt(0), 0, 5);

            // can't change APPEAL
            for (let i = 0; i < 5; i++) {
                crossword.insertLetter('B'.charCodeAt(0), 0, i);
                expect(crossword.getStatus()[0][i].input).not.toEqual('b');
            }
        });

        it('should allow overwriting letter if the word is not found', async () => {
            await crossword.newGame('easy');
            // Insert AAAAA
            for (let i = 0; i < 5; i++) {
                crossword.insertLetter('A'.charCodeAt(0), 0, i);
                expect(crossword.getStatus()[0][i].input).toEqual('a');
            }
            // can change AAAAA to BBBBB
            for (let i = 0; i < 5; i++) {
                crossword.insertLetter('B'.charCodeAt(0), 0, i);
                expect(crossword.getStatus()[0][i].input).toEqual('b');
            }
        });
    });

    describe('eraseLetter()', () => {
        it('should not erase a letter if the word is found', async () => {
            await crossword.newGame('easy');
            // Insert APPEAL
            crossword.insertLetter('A'.charCodeAt(0), 0, 0);
            crossword.insertLetter('P'.charCodeAt(0), 0, 1);
            crossword.insertLetter('P'.charCodeAt(0), 0, 2);
            crossword.insertLetter('E'.charCodeAt(0), 0, 3);
            crossword.insertLetter('A'.charCodeAt(0), 0, 4);
            crossword.insertLetter('L'.charCodeAt(0), 0, 5);

            // can't erase APPEAL
            for (let i = 0; i < 5; i++) {
                crossword.eraseLetter(0, i);
                expect(crossword.getStatus()[0][i].input).not.toEqual('');
            }
        });

        it('should erase a letter if the word is not found', async () => {
            await crossword.newGame('easy');
            // Insert AAAAA
            for (let i = 0; i < 5; i++) {
                crossword.insertLetter('A'.charCodeAt(0), 0, i);
                expect(crossword.getStatus()[0][i].input).toEqual('a');
            }

            // can erase AAAAA
            for (let i = 0; i < 5; i++) {
                crossword.eraseLetter(0, i);
                expect(crossword.getStatus()[0][i].input).toEqual('');
            }
        });
    });

    describe('setSelectedWord()', () => {
        it('should set APPEAL as selected', async () => {
            await crossword.newGame('easy');
            // unselected
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].selected).toBeFalsy();
            }
            crossword.setSelectedWord('appeal');
            // selected
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].selected).toBeTruthy();
            }
        });
    });

    describe('clearSelectedWord()', () => {
        it('should clear the previously selected word', async () => {
            await crossword.newGame('easy');
            crossword.setSelectedWord('appeal');
            // selected
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].selected).toBeTruthy();
            }
            crossword.clearSelectedWord('appeal');
            // unselected
            for (let i = 0; i < 5; i++) {
                expect(crossword.getStatus()[0][i].selected).toBeFalsy();
            }
        });
    });*/
});
