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

    describe('addToFoundWords()', () => {
        it('should add a word to foundWords', () => {
            pointsService.addToFoundWords('hello');
            expect(pointsService['foundWords'].has('hello')).toBeTruthy();
        });
    });

    describe('found()', () => {
        it('should be true when a found is marked as found', () => {
            pointsService['foundWords'].add('hello');
            expect(pointsService.found('hello')).toBeTruthy();
        });

        it('should be false when a found is not marked as found', () => {
            expect(pointsService.found('hello')).toBeFalsy();
        });
    });

    describe('foundWordAlerts()', () => {
        it('should alert when a found is found', (done) => {
            pointsService.foundWordAlerts().subscribe((newlyFoundWord) => {
                expect(newlyFoundWord).toBe('hello');
                done();
            });
            pointsService['foundWordSubject'].next('hello');
        });
    });
});
