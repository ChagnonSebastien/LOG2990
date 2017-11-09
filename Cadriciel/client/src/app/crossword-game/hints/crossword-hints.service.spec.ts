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

fdescribe('#CrosswordHintsService', () => {

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
    });

    describe('unselectHint()', () => {
        it('should unselect the hint', () => {
            hintsService.unselectHint();
            expect(hintsService.selectedWord).toBeUndefined();
        });
    });
});
