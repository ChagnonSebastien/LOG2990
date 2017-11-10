import { TestBed } from '@angular/core/testing';

import { CrosswordLobbyService } from './crossword-lobby.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';
import { CrosswordSocketService } from '../socket/crossword-socket.service';

import { CrosswordGameInfo } from '../../../../../commun/crossword/crossword-game-info';

let lobbyService: CrosswordLobbyService;

describe('#CrosswordLobbyService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordLobbyService,
                CrosswordSocketService,
                CrosswordPlayerService
            ]
        });
        lobbyService = TestBed.get(CrosswordLobbyService);
    });

    it('should construct', () => {
        expect(lobbyService).toBeDefined();
    });

    it('should get active games', (done => {
        setTimeout(() => {
            expect(lobbyService.games).toBeDefined();
            done();
        }, 50);
    }));

    describe('canJoinGame()', () => {
        it('should return false when the username is empty', () => {
            lobbyService['playerService'].username = '';
            expect(lobbyService.canJoinGame('fakegameid')).toBeFalsy();
        });

        it('should return false when the game is not found', () => {
            expect(lobbyService.canJoinGame('doesnotexist')).toBeFalsy();
        });

        it('should return false when there are already players in it', () => {
            lobbyService['playerService'].username = 'fakeusername';
            const game = new CrosswordGameInfo('fakegameid', 'fakehost', 'easy', 'classic', 'fakeopponent');
            lobbyService['gamesMap'] = new Map<string, CrosswordGameInfo>();
            lobbyService['gamesMap'].set('fakegameid', game);
            expect(lobbyService.canJoinGame('fakegameid')).toBeFalsy();
        });
    });

    describe('joinGame()', () => {
        it('should emit join game when it meets the requirements to join a game', () => {
            lobbyService['playerService'].username = 'fakeusername';
            const game = new CrosswordGameInfo('fakegameid', 'fakehost', 'easy', 'classic', '');
            lobbyService['gamesMap'] = new Map<string, CrosswordGameInfo>();
            lobbyService['gamesMap'].set('fakegameid', game);
            expect(lobbyService.joinGame('fakegameid')).toBeTruthy();
        });

        it('should not emit join game when it does not meet the requirements to join a game', () => {
            lobbyService['playerService'].username = 'fakeusername';
            const game = new CrosswordGameInfo('fakegameid', 'fakehost', 'easy', 'classic', 'fakeopponent');
            lobbyService['gamesMap'] = new Map<string, CrosswordGameInfo>();
            lobbyService['gamesMap'].set('fakegameid', game);
            expect(lobbyService.joinGame('fakegameid')).toBeFalsy();
        });
    });

});
