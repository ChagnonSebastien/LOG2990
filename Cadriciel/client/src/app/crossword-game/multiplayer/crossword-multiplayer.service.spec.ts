import { TestBed } from '@angular/core/testing';

import { CrosswordMultiplayerService } from './crossword-multiplayer.service';
import { CrosswordSocketService } from '../socket/crossword-socket.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';

let multiplayerService: CrosswordMultiplayerService;

describe('#CrosswordMultiplayerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordMultiplayerService,
                CrosswordSocketService,
                CrosswordPlayerService
            ]
        });
        multiplayerService = TestBed.get(CrosswordMultiplayerService);
    });

    it('should construct', () => {
        expect(multiplayerService).toBeDefined();
    });
});
