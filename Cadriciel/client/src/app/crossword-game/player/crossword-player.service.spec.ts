import { TestBed } from '@angular/core/testing';

import { CrosswordPlayerService } from './crossword-player.service';

let playerService: CrosswordPlayerService;

describe('#CrosswordPlayerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordPlayerService]
        });
        playerService = TestBed.get(CrosswordPlayerService);
    });

    it('should construct', () => {
        expect(playerService).toBeDefined();
    });

    it('should have no username at initialization', () => {
        expect(playerService.username).toEqual('');
    });
});
