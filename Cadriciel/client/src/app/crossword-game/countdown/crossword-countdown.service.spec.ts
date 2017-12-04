import { TestBed } from '@angular/core/testing';

import { CrosswordCountdownService } from './crossword-countdown.service';

import { GameConfiguration } from '../game-configuration';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';

let countdownService: CrosswordCountdownService;

describe('#CrosswordCountdownService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordCountdownService,
                CrosswordConfigurationService
            ]
        });
        countdownService = TestBed.get(CrosswordCountdownService);
    });

    it('should construct', () => {
        expect(countdownService).toBeDefined();
    });

    describe('newGame()', () => {
        it('should initialize the initialCount to the one specified in the game configuration', () => {
            countdownService.newGame();
            expect(countdownService['initialCount'])
                .toEqual(GameConfiguration.INITIAL_COUNTDOWN_VALUE);
        });

        it('should start the countdown', () => {
            expect(countdownService['countdownId']).toBeUndefined();
            countdownService.newGame();
            expect(countdownService['countdownId']).toBeDefined();
        });

        it('should reset the countdown', () => {
            countdownService.newGame();
            expect(countdownService.count).toEqual(countdownService['initialCount']);
        });

        it('should return true when a game is not already started', () => {
            expect(countdownService.newGame()).toBeTruthy();
        });

        it('should return false when a game is already started', () => {
            expect(countdownService.newGame()).toBeTruthy();
            expect(countdownService.newGame()).toBeFalsy();
        });
    });

    describe('stopCountdown()', () => {
        it('should return true when a game is in progress', () => {
            expect(countdownService.newGame()).toBeTruthy();
            expect(countdownService.stopCountdown()).toBeTruthy();
        });

        it('should return false when a game is not in progress', () => {
            expect(countdownService.stopCountdown()).toBeFalsy();
        });

        it('should stop the countdown', () => {
            expect(countdownService.newGame()).toBeTruthy();
            expect(countdownService['countdownId']).toBeDefined();
            expect(countdownService.stopCountdown()).toBeTruthy();
            expect(countdownService['countdownId']).toBeUndefined();
        });
    });

    describe('countdownReachedZeroAlerts()', () => {
        it('should alert when the count reaches zero', (done) => {
            countdownService.countdownReachedZeroAlerts()
                .subscribe((count) => {
                    expect(count).toBeTruthy();
                    done();
                });
            countdownService.count = 0;
            (countdownService as any).decrementCounter();
        });
    });

    describe('resetCountdown()', () => {
        it('should return true when the count is reset to between 0 and the initial', () => {
            expect(countdownService.newGame()).toBeTruthy();
            expect(countdownService.resetCountdown()).toBeTruthy();
            expect(countdownService['count']).toBeGreaterThanOrEqual(0);
            expect(countdownService['count']).toBeLessThanOrEqual(countdownService['initialCount']);
        });
    });
});
