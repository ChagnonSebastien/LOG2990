import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { HttpModule } from '@angular/http';

import { CrosswordHintsService } from './crossword-hints.service';
import { LexiconService } from '../lexicon/lexicon.service';
import { CrosswordWordsService } from '../words/crossword-words.service';

import { Word } from '../../../../../commun/word';

class MockLexiconService extends LexiconService {
    public getWordDefinitions(words: Array<string>): Observable<any> {
        return Observable.forkJoin(
            words.map((word) => {
                return Promise.resolve(`Definition of ${word}`);
            })
        );
    }
}

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

let hintsService: CrosswordHintsService;
/*
describe('#CrosswordHintsService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CrosswordHintsService,
                CrosswordWordsService,
                { provide: LexiconService, useClass: MockLexiconService }
            ]
        });
        hintsService = TestBed.get(CrosswordHintsService);
        hintsService.newGame(wordsWithIndex);
    });

    it('should construct', () => {
        expect(hintsService).toBeDefined();
    });

    describe('newGame()', () => {
        it('should initialize a new game', () => {
            hintsService.newGame(wordsWithIndex);

            // initialize attributes
            expect(hintsService.selectedWord).toBeUndefined();
            expect(hintsService.opponentSelectedWord).toBeUndefined();
            expect(hintsService.hints).toBeDefined();
        });
    });

    describe('selectedWordAlerts()', () => {
        it('should be subscribable and receive word selection alerts', (done) => {
            hintsService.selectedWordAlerts().subscribe((hintSelection) => {
                expect(hintSelection.previous).toBeUndefined();
                expect(hintSelection.current).toEqual(wordsWithIndex[0]);
                done();
            });
            hintsService['selectedWordSubject'].next({
                'previous': undefined,
                'current': wordsWithIndex[0]
            });
        });
    });

    describe('selectWord()', () => {
        beforeEach(() => {
            hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
        });

        it('should select a word that exists in the crossword', () => {
            expect(hintsService.selectWord('huh')).toBeTruthy();
            expect(hintsService.selectedWord).toEqual('huh');
        });

        it('should not select a word that does not exist in the crossword', () => {
            expect(hintsService.selectWord('idontexist')).toBeFalsy();
            expect(hintsService.selectedWord).toBeUndefined();
        });

        it('should not select a word that is already being selected', () => {
            expect(hintsService.selectWord('huh')).toBeTruthy();
            expect(hintsService.selectWord('huh')).toBeFalsy();
        });

        it('should alert when a new word is selected', (done) => {
            hintsService['selectedWordSubject'].asObservable()
                .subscribe((hint) => {
                    expect(hint.previous).toBeUndefined();
                    expect(hint.current).toEqual(wordsWithIndex[0]);
                    done();
                });
            expect(hintsService.selectWord('huh')).toBeTruthy();
            expect(hintsService.selectWord('huh')).toBeFalsy();
        });
    });

    describe('unselectHint()', () => {
        it('should unselect the hint', () => {
            hintsService.selectedWord = 'huh';
            hintsService.deselectHint();
            expect(hintsService.selectedWord).toBeUndefined();
        });
    });

    describe('markHintAsFound()', () => {
        it('should mark hint as found when selected', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.selectedWord = 'huh';
            expect(hintsService.markHintAsFound('huh')).toBeTruthy();
            expect(hintsService.hints[0].found).toBeTruthy();
        });

        it('should not mark hint as found when not selected', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.selectedWord = undefined;
            expect(hintsService.markHintAsFound('huh')).toBeFalsy();
            expect(hintsService.hints[0].found).toBeFalsy();
        });

        it('should not mark hint as found when it does not exist', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.selectedWord = 'idontexist';
            expect(hintsService.markHintAsFound('idontexist')).toBeFalsy();
        });

        it('should unselect the hint when it is marked as found', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.selectedWord = 'huh';
            expect(hintsService.markHintAsFound('huh')).toBeTruthy();
            expect(hintsService.hints[0].found).toBeTruthy();
            expect(hintsService.selectedWord).toBeUndefined();
        });

        it('should unselect the opponent hint when it is marked as found if the opponent was selecting it', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.selectedWord = 'huh';
            hintsService.opponentSelectedWord = 'huh';
            expect(hintsService.markHintAsFound('huh')).toBeTruthy();
            expect(hintsService.hints[0].found).toBeTruthy();
            expect(hintsService.opponentSelectedWord).toBeUndefined();
        });

        it('should not unselect the opponent hint when it is marked as found if the opponent was not selecting it', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.selectedWord = 'huh';
            hintsService.opponentSelectedWord = 'aloud';
            expect(hintsService.markHintAsFound('huh')).toBeTruthy();
            expect(hintsService.hints[0].found).toBeTruthy();
            expect(hintsService.opponentSelectedWord).toEqual('aloud');
        });
    });

    describe('markHintAsFoundByOpponent()', () => {
        it('should mark hint as found by opponent if it exists', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            expect(hintsService.markHintAsFoundByOpponent('huh')).toBeTruthy();
            expect(hintsService.hints[0].opponentFound).toBeTruthy();
        });

        it('should not mark hint as found when it does not exist', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            expect(hintsService.markHintAsFoundByOpponent('idontexist')).toBeFalsy();
        });

        it('should unselect the hint when it is marked as found if you were selecting it', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.selectedWord = 'huh';
            hintsService.opponentSelectedWord = 'huh';
            expect(hintsService.markHintAsFoundByOpponent('huh')).toBeTruthy();
            expect(hintsService.hints[0].opponentFound).toBeTruthy();
            expect(hintsService.selectedWord).toBeUndefined();
        });

        it('should unselect the opponent hint when it is marked as found', async () => {
            await hintsService.newGame(wordsWithIndex);
            hintsService['wordsService'].newGame(wordsWithIndex);
            hintsService.opponentSelectedWord = 'huh';
            expect(hintsService.markHintAsFoundByOpponent('huh')).toBeTruthy();
            expect(hintsService.hints[0].opponentFound).toBeTruthy();
            expect(hintsService.opponentSelectedWord).toBeUndefined();
        });
    });
});*/
