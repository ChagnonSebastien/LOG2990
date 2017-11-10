import { TestBed } from '@angular/core/testing';

import { CrosswordPointsService } from './crossword-points.service';
import { CrosswordWordsService } from '../words/crossword-words.service';

import { Word } from '../../../../../commun/word';

let pointsService: CrosswordPointsService;

const wordsWithIndex: Array<Word> = [
    { 'i': 0, 'j': 0, 'word': 'huh', 'horizontal': true },
    { 'i': 0, 'j': 9, 'word': 'downstairs', 'horizontal': false },
    { 'i': 0, 'j': 5, 'word': 'aloud', 'horizontal': true },
    { 'i': 2, 'j': 6, 'word': 'slow', 'horizontal': true },
    { 'i': 2, 'j': 6, 'word': 'swelling', 'horizontal': false },
    { 'i': 4, 'j': 1, 'word': 'exposed', 'horizontal': true },
    { 'i': 3, 'j': 4, 'word': 'donna', 'horizontal': false },
    { 'i': 3, 'j': 2, 'word': 'oxford', 'horizontal': false },
    { 'i': 8, 'j': 0, 'word': 'sad', 'horizontal': true },
    { 'i': 6, 'j': 0, 'word': 'cash', 'horizontal': false },
    { 'i': 9, 'j': 3, 'word': 'bingo', 'horizontal': true },
    { 'i': 0, 'j': 0, 'word': 'hum', 'horizontal': false }
];

describe('#CrosswordPointsService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordPointsService,
                CrosswordWordsService
            ]
        });
        pointsService = TestBed.get(CrosswordPointsService);
    });

    it('should construct', () => {
        expect(pointsService).toBeDefined();
    });

    describe('newGame()', () => {
        it('should initialize foundWords', () => {
            pointsService.newGame();
            expect(pointsService.foundWords).toBeDefined();
            expect(pointsService.foundWords.size).toEqual(0);
        });

        it('should initialize opponentFoundWords', () => {
            pointsService.newGame();
            expect(pointsService.opponentFoundWords).toBeDefined();
            expect(pointsService.opponentFoundWords.size).toEqual(0);
        });
    });

    describe('addToFoundWords()', () => {
        beforeEach(() => {
            pointsService['wordsService'].newGame(wordsWithIndex);
        });

        it('should add a word to foundWords if it exists and the opponent has not found it', () => {
            expect(pointsService.opponentFoundWords.has('huh')).toBeFalsy();
            expect(pointsService.addToFoundWords('huh')).toBeTruthy();
        });

        it('should not add a word to foundWords if it does not exist', () => {
            expect(pointsService.addToFoundWords('idontexist')).toBeFalsy();
        });

        it('should not add a word to foundWords if the opponent already found it', () => {
            pointsService.opponentFoundWords.add('huh');
            expect(pointsService.addToFoundWords('huh')).toBeFalsy();
        });
    });

    describe('addToOpponentFoundWords()', () => {
        beforeEach(() => {
            pointsService['wordsService'].newGame(wordsWithIndex);
        });

        it('should add a word to opponentFoundWords if it exists and you have not found it', () => {
            expect(pointsService.foundWords.has('huh')).toBeFalsy();
            expect(pointsService.addToOpponentFoundWords('huh')).toBeTruthy();
        });

        it('should not add a word to opponentFoundWords if it does not exist', () => {
            expect(pointsService.addToOpponentFoundWords('idontexist')).toBeFalsy();
        });

        it('should not add a word to opponentFoundWords if you have already found it', () => {
            pointsService.foundWords.add('huh');
            expect(pointsService.addToOpponentFoundWords('huh')).toBeFalsy();
        });
    });

    describe('gameCompletedAlerts()', () => {
        beforeEach(() => {
            pointsService['wordsService'].newGame(wordsWithIndex);
        });

        it('should alert the subscribers when all words have been found', (done) => {
            pointsService.gameCompletedAlerts().subscribe((endGame) => {
                expect(endGame).toBeTruthy();
                done();
            });

            for (const word of wordsWithIndex) {
                if (Math.random() > 0.5) {
                    pointsService.addToFoundWords(word.word);
                } else {
                    pointsService.addToOpponentFoundWords(word.word);
                }
            }
        });

        it('should not alert the subscribers until all words have been found', (done) => {
            pointsService.gameCompletedAlerts().subscribe((endGame) => {
                // this will never be called
                expect(false).toBeTruthy();
            });

            for (let i = 0; i < wordsWithIndex.length - 1; i++) {
                if (Math.random() > 0.5) {
                    pointsService.addToFoundWords(wordsWithIndex[i].word);
                } else {
                    pointsService.addToOpponentFoundWords(wordsWithIndex[i].word);
                }
            }

            setTimeout(done, 50);
        });
    });
});
