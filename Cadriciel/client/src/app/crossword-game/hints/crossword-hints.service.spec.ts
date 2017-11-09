import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { HttpModule } from '@angular/http';

import { CrosswordHintsService } from './crossword-hints.service';
import { LexiconService } from '../lexicon/lexicon.service';

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

describe('#CrosswordHintsService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                CrosswordHintsService,
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

        it('should create a hint for every word in wordsWithIndex with its definition', async () => {
            await hintsService.newGame(wordsWithIndex);

            // every word of wordsWithIndex is in hints
            for (const hint of hintsService.hints) {
                expect(hintsService['wordMap'].get(hint.word)).toBeDefined();
                expect(hint.definition).toEqual(`Definition of ${hint.word}`);
            }
        });
    });

    describe('getWordInfo()', () => {
        it('should return the word info of the word', () => {
            for (const wordWithIndex of wordsWithIndex) {
                expect(hintsService.getWordWithIndex(wordWithIndex.word)).toEqual(wordWithIndex);
            }
        });
    });

    describe('selectWord()', () => {
        it('should select the word given if it exists in the hints', () => {
            expect(hintsService.selectedWord).toBeUndefined();
            hintsService.selectWord('huh');
            expect(hintsService.selectedWord).toEqual('huh');
        });

        it('should not select a word that does not exist in the hints', () => {
            // undefined selected word stays undefined
            expect(hintsService.selectedWord).toBeUndefined();
            hintsService.selectWord('thisdoesnotexist');
            expect(hintsService.selectedWord).toBeUndefined();

            // selected word stays the same
            hintsService.selectWord('huh');
            expect(hintsService.selectedWord).toEqual('huh');
            hintsService.selectWord('whyareyoutryingagain');
            expect(hintsService.selectedWord).toEqual('huh');
        });

        it('should notify when the selected word changes', (done) => {
            hintsService.selectedWordAlerts().subscribe((hintChange) => {
                expect(hintChange.previous).toBeUndefined();
                expect(hintChange.current.word).toEqual('huh');
                done();
            });

            hintsService.selectWord('huh');
        });
    });

    describe('unselectHint()', () => {
        it('should unselect the hint', () => {
            hintsService.unselectHint();
            expect(hintsService.selectedWord).toBeUndefined();
        });
    });
});
