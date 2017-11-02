import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { HttpModule } from '@angular/http';

import { CrosswordHintsService } from './crossword-hints.service';
import { CrosswordPointsService } from '../crossword-points/crossword-points.service';
import { CrosswordGridService } from '../crossword-grid/crossword-grid.service';
import { LexiconService } from '../lexicon.service';

class MockLexiconService extends LexiconService {
    public getWordDefinitions(words: Array<string>): Observable<any> {
        return Observable.forkJoin(
            words.map((word) => {
                return Promise.resolve(`Definition of ${word}`);
            })
        );
    }
}

const wordsWithIndex = [
    { 'i': 0, 'j': 0, 'word': 'huh', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8f' },
    { 'i': 0, 'j': 9, 'word': 'downstairs', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe8e' },
    { 'i': 0, 'j': 5, 'word': 'aloud', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8d' },
    { 'i': 2, 'j': 6, 'word': 'slow', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8c' },
    { 'i': 2, 'j': 6, 'word': 'swelling', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe8b' },
    { 'i': 4, 'j': 1, 'word': 'exposed', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe8a' },
    { 'i': 3, 'j': 4, 'word': 'donna', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe89' },
    { 'i': 3, 'j': 2, 'word': 'oxford', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe88' },
    { 'i': 8, 'j': 0, 'word': 'sad', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe87' },
    { 'i': 6, 'j': 0, 'word': 'cash', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe86' },
    { 'i': 9, 'j': 3, 'word': 'bingo', 'horizontal': true, '_id': '59f23db6cfb7c4030284fe85' },
    { 'i': 0, 'j': 0, 'word': 'hum', 'horizontal': false, '_id': '59f23db6cfb7c4030284fe84' }
];

let hintsService: CrosswordHintsService;

describe('#CrosswordHintsService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CrosswordHintsService,
                CrosswordPointsService,
                CrosswordGridService,
                { provide: LexiconService, useClass: MockLexiconService }
            ]
        });
        hintsService = TestBed.get(CrosswordHintsService);
    });

    it('should construct', () => {
        expect(hintsService).toBeDefined();
    });

    describe('newGame()', () => {
        it('should initialize a new game', () => {
            hintsService.newGame(wordsWithIndex);

            // initialize attributes
            expect(hintsService.selectedWord).toBeUndefined();
            expect(hintsService['wordMap']).toBeDefined();
            expect(hintsService.hints).toBeDefined();


        });

        it('should construct a wordMap for O(1) access to info on a word', () => {
            hintsService.newGame(wordsWithIndex);

            for (const wordWithIndex of wordsWithIndex) {
                expect(hintsService['wordMap'].get(wordWithIndex.word)).toBeDefined();
                expect(hintsService['wordMap'].get(wordWithIndex.word).word).toEqual(wordWithIndex.word);
            }
        });

        it('should create a hint for every word in wordsWithIndex with its definition', () => {
            hintsService.newGame(wordsWithIndex);

            // every word of wordsWithIndex is in hints
            for (const hint of hintsService.hints) {
                expect(hintsService['wordMap'].get(hint.word)).toBeDefined();
                expect(hint.definition).toEqual(`Definition of ${hint.word}`);
            }
        });
    });

    describe('getWordInfo()', () => {
        it('should return the word info of the word', () => {
            hintsService.newGame(wordsWithIndex);

            for (const wordWithIndex of wordsWithIndex) {
                expect(hintsService.getWordInfo(wordWithIndex.word)).toEqual(wordWithIndex);
            }
        });
    });

    describe('selectWord()', () => {
        it('should select the word given', () => {

        });
    });
});
