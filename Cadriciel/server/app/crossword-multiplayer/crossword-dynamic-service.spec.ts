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
import { Crossword } from '../../../commun/crossword/crossword';

const TEST_HOST = 'http://localhost';
const TEST_PORT = 3002;
let app: express.Application;
let server: http.Server;
let dynamicService: CrosswordDynamicService;
let gamesManager: CrosswordGamesManager;
let mutationManager: CrosswordMutationManager;

describe('#CrosswordDynamicService', () => {
    let socket: SocketIOClient.Socket;
    const SOCKET_ID = 'testSocketId';
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
        game = await gamesManager.createGame(difficulty, mode, hostUsername, SOCKET_ID);
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

        it('should tell the mutation manager that a word was found', () => {
            const foundWord = game.crossword.wordsWithIndex[1];

            // Word not marked as found in mutation manager
            expect(
                mutationManager
                    .getNextMutation(GAME_ID)
                    .wordsWithIndex
                    .filter((word) => {
                        return word.word === foundWord.word;
                    }).length
            ).to.equal(0);

            dynamicService.foundWord(GAME_ID, game, foundWord);

            // Word now found in mutation manager
            expect(
                mutationManager
                    .getNextMutation(GAME_ID)
                    .wordsWithIndex
                    .filter((word) => {
                        return word.word === foundWord.word;
                    }).length
            ).to.equal(1);
        });

        it('should emit the next mutated crossword to players in the game', (done) => {
            const foundWord = game.crossword.wordsWithIndex[2];

            socket.on('update mutation', (mutation: Crossword) => {
                expect(mutation.difficulty)
                    .to.equal(difficulty);
                expect(
                    mutation.wordsWithIndex
                        .filter((word) => {
                            return word.word === foundWord.word;
                        }).length
                ).to.equal(1);
                done();
            });

            dynamicService.foundWord(GAME_ID, game, foundWord);
        });
    });

    describe('listenForNewCountdown()', () => {
        before(() => {
            dynamicService.listenForNewCountdown();
        });

        it('should listen for new initial countdown values on sockets', (done) => {
            gamesManager
                .createGame(difficulty, mode, hostUsername, socket.id)
                .then((cheatModeGame) => {
                    const newCountdown = 123;
                    expect(cheatModeGame.countdown.initialCountdownValue)
                        .to.equal(INITIAL_COUNTDOWN_VALUE);

                    let capturedCounts = 0;
                    cheatModeGame.countdown.count
                        .subscribe((count: number) => {
                            if (capturedCounts === 1) {
                                expect(cheatModeGame.countdown.initialCountdownValue)
                                    .to.equal(newCountdown);
                                expect(count)
                                    .to.equal(newCountdown);
                                done();
                            }
                            capturedCounts++;
                        });

                    socket.emit('new countdown', newCountdown);
                });
        });
    });
});
