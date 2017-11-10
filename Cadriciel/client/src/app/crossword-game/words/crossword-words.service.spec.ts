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
    /*
        public getWordWithIndex(word: string): Word {
        return this.wordMap.get(word);
    } */

});
