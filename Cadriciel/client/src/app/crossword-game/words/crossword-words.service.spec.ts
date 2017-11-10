import { CrosswordWordsService } from './crossword-words.service';
import { TestBed } from '@angular/core/testing';

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
});
