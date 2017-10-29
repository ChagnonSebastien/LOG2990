import { TestBed } from '@angular/core/testing';

import { CrosswordPointsService } from './crossword-points.service';

let pointsService: CrosswordPointsService;

describe('#CrosswordPointsService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordPointsService
            ]
        });
        pointsService = TestBed.get(CrosswordPointsService);
    });

    it('should construct', () => {
        expect(pointsService).toBeDefined();
    });

    describe('newGame()', () => {
        it('should reinitialize a game', () => {
            pointsService.newGame();
            pointsService.addToFoundWords('hello');
            expect(pointsService.found('hello')).toBeTruthy();
            pointsService.newGame();
            expect(pointsService.found('hello')).toBeFalsy();
        });
    });
});
