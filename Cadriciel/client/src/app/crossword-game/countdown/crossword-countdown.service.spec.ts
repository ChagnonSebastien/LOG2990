import { TestBed } from '@angular/core/testing';

import { CrosswordCountdownService } from './crossword-countdown.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { CrosswordCheatService } from '../cheat/crossword-cheat.service';

let countdownService: CrosswordCountdownService;

fdescribe('#CrosswordCountdownService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordCountdownService,
                CrosswordConfigurationService,
                CrosswordCheatService
            ]
        });
        countdownService = TestBed.get(CrosswordCountdownService);
    });

    it('should construct', () => {
        expect(countdownService).toBeDefined();
    });

    describe('newGame()', () => {
        it('should initialize the counter when the mode is dynamic', () => {
            expect(countdownService.count).toBeUndefined();
            countdownService['configurationService'].mode = 'dynamic';
            countdownService.newGame();
            expect(countdownService.count).toBeDefined();
        });

        it('should not initialize the counter when the mode is classic', () => {
            expect(countdownService.count).toBeUndefined();
            countdownService['configurationService'].mode = 'classic';
            countdownService.newGame();
            expect(countdownService.count).toBeUndefined();
        });

        it('should return true when the mode is dynamic', () => {
            countdownService['configurationService'].mode = 'dynamic';
            expect(countdownService.newGame()).toBeTruthy();
        });

        it('should return false when the mode is classic', () => {
            countdownService['configurationService'].mode = 'classic';
            expect(countdownService.newGame()).toBeFalsy();
        });
    });
});
