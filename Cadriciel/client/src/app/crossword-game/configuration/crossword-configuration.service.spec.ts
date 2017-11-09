import { TestBed } from '@angular/core/testing';

import { CrosswordConfigurationService } from './crossword-configuration.service';

let configurationService: CrosswordConfigurationService;

describe('#CrosswordConfigurationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordConfigurationService]
        });
        configurationService = TestBed.get(CrosswordConfigurationService);
    });

    it('should construct', () => {
        expect(configurationService).toBeDefined();
    });

    describe('startGameAlerts()', () => {
        it('should alert with the configuration', (done) => {
            configurationService.startGameAlerts()
                .subscribe((configuration) => {
                    expect(configuration).toBeDefined();
                    expect(configuration.type).toEqual('solo');
                    expect(configuration.mode).toEqual('classic');
                    expect(configuration.level).toEqual('normal');
                    done();
                });
            configurationService['startGameSubject'].next({
                type: 'solo',
                mode: 'classic',
                level: 'normal'
            });
        });
    });

    describe('startGame()', () => {
        it('should alert the current configuration', (done) => {
            configurationService.startGameAlerts()
                .subscribe((configuration) => {
                    expect(configuration).toBeDefined();
                    expect(configuration.type).toEqual('solo');
                    expect(configuration.mode).toEqual('classic');
                    expect(configuration.level).toEqual('normal');
                    done();
                });
            configurationService.startGame();
        });

        it('should return true', () => {
            expect(configurationService.startGame()).toBeTruthy();
        });
    });

    describe('isMultiplayer()', () => {
        it('should return true when the type is multiplayer', () => {
            configurationService.type = 'multiplayer';
            expect(configurationService.isMultiplayer()).toBeTruthy();
        });

        it('should return false when the type is solo', () => {
            configurationService.type = 'solo';
            expect(configurationService.isMultiplayer()).toBeFalsy();
        });
    });

    describe('isDynamic()', () => {
        it('should return true when the mode is dynamic', () => {
            configurationService.mode = 'dynamic';
            expect(configurationService.isDynamic()).toBeTruthy();
        });

        it('should return false when the mode is classic', () => {
            configurationService.mode = 'classic';
            expect(configurationService.isDynamic()).toBeFalsy();
        });
    });

    describe('setType()', () => {
        it('should return true when the input is solo or multiplayer', () => {
            expect(configurationService.setType('solo')).toBeTruthy();
            expect(configurationService.setType('multiplayer')).toBeTruthy();
        });

        it('should return false when the input is not solo or multiplayer', () => {
            expect(configurationService.setType('single')).toBeFalsy();
            expect(configurationService.setType('twoplayer')).toBeFalsy();
        });
    });

    describe('setMode()', () => {
        it('should return true when the input is classic or dynamic', () => {
            expect(configurationService.setMode('classic')).toBeTruthy();
            expect(configurationService.setMode('dynamic')).toBeTruthy();
        });

        it('should return false when the input is not classic or dynamic', () => {
            expect(configurationService.setMode('antique')).toBeFalsy();
            expect(configurationService.setMode('synergistic')).toBeFalsy();
        });
    });

    describe('setLevel()', () => {
        it('should return true when the input is easy, normal or hard', () => {
            expect(configurationService.setLevel('easy')).toBeTruthy();
            expect(configurationService.setLevel('normal')).toBeTruthy();
            expect(configurationService.setLevel('hard')).toBeTruthy();
        });

        it('should return false when the input is not easy, normal or hard', () => {
            expect(configurationService.setLevel('facile')).toBeFalsy();
            expect(configurationService.setLevel('average')).toBeFalsy();
            expect(configurationService.setLevel('difficult')).toBeFalsy();
        });
    });
});
