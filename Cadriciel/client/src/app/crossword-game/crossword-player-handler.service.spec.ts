import { TestBed } from '@angular/core/testing';

import { PlayerHandlerService } from './crossword-player-handler.service';

let playerHandlerService: PlayerHandlerService;

describe('PlayerHandlerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PlayerHandlerService
            ]
        });
        playerHandlerService = TestBed.get(PlayerHandlerService);
    });

    it('should be created', () => {
        expect(playerHandlerService).toBeDefined();
    });

    it('should return an active player', () => {
        expect(playerHandlerService.requestPlayer()).toBeDefined();
    });

});
