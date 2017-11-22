import { expect } from 'chai';
import * as http from 'http';
import * as express from 'express';
import * as io from 'socket.io-client';

import { SocketServer } from '../socket-server';
import { CrosswordDynamicService } from './crossword-dynamic-service';
import { CrosswordGamesManager } from './crossword-games-manager';
import { CrosswordMutationManager } from './crossword-mutation-manager';
import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';
import { INITIAL_COUNTDOWN_VALUE } from '../config';

const TEST_HOST = 'http://localhost';
const TEST_PORT = 3002;
let app: express.Application;
let server: http.Server;
let dynamicService: CrosswordDynamicService;
let gamesManager: CrosswordGamesManager;
let mutationManager: CrosswordMutationManager;

describe('#CrosswordDynamicService', () => {
    let socket: SocketIOClient.Socket;
    const GAME_ID = 'testGameId';
    const difficulty = 'easy';
    const mode = 'dynamic';
    const hostUsername = 'testUser';
    let game: MultiplayerCrosswordGame;

    before(() => {
        app = express();
        server = http.createServer(app);
        server.listen(TEST_PORT);
        SocketServer.setServer(server);
        dynamicService = CrosswordDynamicService.getInstance();
        gamesManager = CrosswordGamesManager.getInstance();
        mutationManager = CrosswordMutationManager.getInstance();
        SocketServer.getInstance().on('connection',
            (serverSocket: SocketIO.Socket) => {
                serverSocket.join(GAME_ID);

                serverSocket.on('disconnect', () => {
                    serverSocket.leave(GAME_ID);
                });
            });
    });

    before(async () => {
        game = await gamesManager.createGame(difficulty, mode, hostUsername, 'socketId');
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
            expect(CrosswordDynamicService.getInstance())
                .to.equal(CrosswordDynamicService.getInstance());
        });
    });

    describe('startDynamicGame()', () => {

        it('should tell the mutation manager to manage a new game', () => {
            dynamicService.startDynamicGame(GAME_ID, game);
            expect(mutationManager.getNextMutation(GAME_ID).difficulty)
                .to.equal(difficulty);
        });

        it('should emit the current countdown to players in the game to synchronize their clocks', (done) => {
            socket.on('current countdown', (count: number) => {
                expect(count)
                    .to.equal(game.countdown.count.value);
                done();
            });
        });

        it('should start the countdown of the game', (done) => {
            const previousCount = game.countdown.count.value;
            let capturedCounts = 0;
            game.countdown.count.subscribe((count) => {
                if (capturedCounts === 1) {
                    expect(count).to.not.equal(previousCount);
                    done();
                }
                capturedCounts++;
            });
        });
    });

    describe('foundWord()', () => {
        it('should reset the countdown', (done) => {
            let capturedCounts = 0;
            const subscription = game.countdown.count
                .subscribe((count) => {
                    if (capturedCounts === 1) {
                        expect(count)
                            .to.equal(INITIAL_COUNTDOWN_VALUE);
                        subscription.unsubscribe();
                        done();
                    }
                    capturedCounts++;
                });
            const foundWord = game.crossword.wordsWithIndex[0];
            dynamicService.foundWord(GAME_ID, game, foundWord);
        });
    });
});
