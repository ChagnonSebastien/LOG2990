import { CrosswordWordsService } from './crossword-words.service';
import { TestBed } from '@angular/core/testing';
import { Word } from '../../../../../commun/word';

let crosswordWordsService: CrosswordWordsService;

describe('CrosswordWordsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordWordsService]
        });
        crosswordWordsService = TestBed.get(CrosswordWordsService);
    });

    it('should construct', () => {
        expect(crosswordWordsService).toBeDefined();
    });

    it('Should initialize new word map', () => {
        const word = new Word(0 , 0, 'cat', true);
        crosswordWordsService.newGame([word]);
        expect(crosswordWordsService['wordMap'].get('cat')).toEqual(word);
    });

    it('Returns the Word object according to word', () => {
        const word = new Word(0 , 0, 'cat', true);
        crosswordWordsService.newGame([word]);
        const wordResult = crosswordWordsService.getWordWithIndex('cat');
        expect(wordResult).toEqual(word);
    });

    it('Returns if the hint exists', () => {
        const word = new Word(0 , 0, 'cat', true);
        crosswordWordsService.newGame([word]);
        const result = crosswordWordsService.hintExists('pouding');
        expect(result).toEqual(false);
    });

    it('returns the number of words', () => {
        const word = new Word(0 , 0, 'cat', true);
        crosswordWordsService.newGame([word]);
        const number = crosswordWordsService.numberOfWords();
        expect(number).toEqual(1);
    });
});
