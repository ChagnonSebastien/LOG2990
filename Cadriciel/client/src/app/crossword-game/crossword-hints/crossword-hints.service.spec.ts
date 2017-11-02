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
});
