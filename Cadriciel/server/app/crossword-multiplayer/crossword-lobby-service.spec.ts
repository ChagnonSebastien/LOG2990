import { expect } from 'chai';
import * as io from 'socket.io-client';

import { CrosswordLobbyService } from './crossword-lobby-service';
import { CrosswordGamesManager } from './crossword-games-manager';

import { TEST_HOST, TEST_PORT } from '../../testing/mock-socket-server';
import { CrosswordGameInfo } from '../../../commun/crossword/crossword-game-info';

let lobbyService: CrosswordLobbyService;
let gamesManager: CrosswordGamesManager;

describe('#CrosswordLobbyService', () => {
    let socket: SocketIOClient.Socket;

    before(() => {
        gamesManager = CrosswordGamesManager.getInstance();
        lobbyService = CrosswordLobbyService.getInstance();
    });

    beforeEach((done) => {
        socket = io.connect(`${TEST_HOST}:${TEST_PORT}`);
        socket.on('connect', () => {
            done();
        });
    });

    after(() => {
        if (socket.connected) {
            socket.disconnect();
        }
    });

    describe('getInstance()', () => {
        it('should return a singleton', () => {
            expect(CrosswordLobbyService.getInstance())
                .to.equal(CrosswordLobbyService.getInstance());
        });
    });

    describe('listenForLobbyRequests()', () => {
        before(() => {
            lobbyService.listenForLobbyRequests();
        });

        it('should listen for create game socket requests', () => {
            expect(gamesManager.getAvailableGames.length).to.equal(0);
            socket.emit('create game', {
                difficulty: 'easy',
                mode: 'classic',
                username: 'fakeUsername'
            });
        });

        it('should listen for get games socket requests', (done) => {
            socket.on('sent all games', (games: CrosswordGameInfo) => {
                done();
            });
            socket.emit('get games');
        });

        it('should listen for join game socket requests', () => {
            socket.emit('join game', { gameId: 0 });
        });

        it('should listen for restart game socket requests', () => {
            socket.emit('restart game', {
                difficulty: 'easy',
                mode: 'classic',
                username: 'fakeUsername'
            });
        });

        it('should listen for socket disconnections', () => {
            socket.emit('disconnect');
        });

        it('should listen for leave game socket requests', () => {
            socket.emit('leaveGame');
        });
    });
});
