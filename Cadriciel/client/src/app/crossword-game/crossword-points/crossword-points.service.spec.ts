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
            pointsService.addToFoundWords('hello');
            // ['attributeName'] to access private attribute for testing purpose only
            expect(pointsService['foundWords'].has('hello')).toBeTruthy();

            // reinitialize
            pointsService.newGame();
            expect(pointsService['foundWords'].size).toBe(0);
            expect(pointsService['foundWords'].has('hello')).toBeFalsy();
        });
    });
});
