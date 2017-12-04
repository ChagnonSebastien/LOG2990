import { TestBed } from '@angular/core/testing';

import { CrosswordCheatService } from './crossword-cheat.service';

let cheatService: CrosswordCheatService;

describe('#CrosswordCheatService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordCheatService]
        });
        cheatService = TestBed.get(CrosswordCheatService);
    });

    it('should construct', () => {
        expect(cheatService).toBeDefined();
    });

    describe('toggleCheatMode()', () => {
        it('should set cheat mode to true when false', () => {
            cheatService.cheatMode = false;
            expect(cheatService.cheatMode).toBeFalsy();
            cheatService.toggleCheatMode();
            expect(cheatService.cheatMode).toBeTruthy();
        });

        it('should set cheat mode to false when true', () => {
            cheatService.cheatMode = true;
            expect(cheatService.cheatMode).toBeTruthy();
            cheatService.toggleCheatMode();
            expect(cheatService.cheatMode).toBeFalsy();
        });

        it('should return the new cheat mode value', () => {
            expect(cheatService.toggleCheatMode()).toBeDefined();
        });
    });

    describe('setInitialCountdown()', () => {
        it('should only set when the parameter is an integer', () => {
            expect(cheatService.setInitialCountdown(10)).toBeTruthy();
            expect(cheatService.setInitialCountdown(10.1)).toBeFalsy();
        });

        it('should only set when the parameter is greater than 0', () => {
            expect(cheatService.setInitialCountdown(0)).toBeFalsy();
            expect(cheatService.setInitialCountdown(1)).toBeTruthy();
        });
    });
});
