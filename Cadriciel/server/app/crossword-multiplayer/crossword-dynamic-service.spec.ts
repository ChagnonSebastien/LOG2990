import { expect } from 'chai';
import * as http from 'http';
import * as express from 'express';

import { SocketServer } from '../socket-server';
import { CrosswordDynamicService } from './crossword-dynamic-service';
import { CrosswordGamesManager } from './crossword-games-manager';
import { CrosswordMutationManager } from './crossword-mutation-manager';
import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';

const TEST_PORT = 3002;
let app: express.Application;
let server: http.Server;
let dynamicService: CrosswordDynamicService;
let gamesManager: CrosswordGamesManager;
let mutationManager: CrosswordMutationManager;

describe('#CrosswordDynamicService', () => {
    before(() => {
        app = express();
        server = http.createServer(app);
        server.listen(TEST_PORT);
        SocketServer.setServer(server);
        dynamicService = CrosswordDynamicService.getInstance();
        gamesManager = CrosswordGamesManager.getInstance();
        mutationManager = CrosswordMutationManager.getInstance();
    });

    describe('getInstance()', () => {
        it('should return a singleton', () => {
            expect(CrosswordDynamicService.getInstance())
                .to.equal(CrosswordDynamicService.getInstance());
        });
    });

    describe('startDynamicGame()', () => {
        const difficulty = 'easy';
        const mode = 'dynamic';
        const hostUsername = 'testUser';
        let game: MultiplayerCrosswordGame;

        before(async () => {
            game = await gamesManager.createGame(difficulty, mode, hostUsername, 'socketId');
        });

        it('should tell the mutation manager to manage a new game', () => {
            dynamicService.startDynamicGame(game.id, game);
            expect(mutationManager.getNextMutation(game.id).difficulty)
                .to.equal(difficulty);
        });
    });
});
