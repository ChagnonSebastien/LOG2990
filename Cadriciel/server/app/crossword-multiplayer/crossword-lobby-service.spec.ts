import { expect } from 'chai';
import * as io from 'socket.io-client';

import { CrosswordLobbyService } from './crossword-lobby-service';
import { CrosswordGamesManager } from './crossword-games-manager';

import { TEST_HOST, TEST_PORT } from '../../testing/mock-socket-server';

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

    afterEach(() => {
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
});
