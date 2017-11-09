import { TestBed } from '@angular/core/testing';

import { CrosswordPointsService } from './crossword-points.service';
import { CrosswordWordsService } from '../words/crossword-words.service';

let pointsService: CrosswordPointsService;

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
});
