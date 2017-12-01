import { expect } from 'chai';
import { CrosswordGamesManager } from './crossword-games-manager';
import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';

describe('#CrosswordGamesManager', () => {
    let gamesManager: CrosswordGamesManager;
    const DIFFICULTY = 'easy';
    const MODE = 'dynamic';
    const HOST_USERNAME = 'testUser';

    before(() => {
        gamesManager = CrosswordGamesManager.getInstance();
    });

    describe('getInstance()', () => {
        it('should be a singleton', () => {
            expect(CrosswordGamesManager.getInstance())
                .to.equal(CrosswordGamesManager.getInstance());
        });
    });

    describe('createGame()', () => {
        let game: MultiplayerCrosswordGame;
        const SOCKET_ID = 'createGameId';
        before(async () => {
            game = await gamesManager
                .createGame(DIFFICULTY, MODE, HOST_USERNAME, SOCKET_ID);
        });

        it('should create a new multiplayer game', () => {
            expect(game.difficulty).to.equal(DIFFICULTY);
            expect(game.mode).to.equal(MODE);
            expect(game.hostUsername).to.equal(HOST_USERNAME);
        });

        it('should store a new game for O(1) access by game id', () => {
            expect(gamesManager['gamesMap'].get(game.id).id).to.equal(game.id);
        });

        it('should store a new game as available to join', () => {
            expect(gamesManager['availableGames'].filter((availableGame) => {
                return game.id === availableGame.id;
            }).length).to.equal(1);
        });

        describe('findGameIdBySocketId()', () => {
            it('should associate the socketId with the gameId', () => {
                expect(gamesManager.findGameIdBySocketId(SOCKET_ID))
                    .to.equal(game.id);
            });
        });
    });

    describe('getAvailableGames()', () => {
        it('should return a list of available games', async () => {
            await gamesManager
                .createGame(DIFFICULTY, MODE, HOST_USERNAME, 'getAvailableGamesId');

            expect(gamesManager.getAvailableGames().length).to.be.at.least(0);
            expect(gamesManager.getAvailableGames()[0].difficulty)
                .to.equal(DIFFICULTY);
            expect(gamesManager.getAvailableGames()[0].mode)
                .to.equal(MODE);
        });
    });

    describe('getGame()', () => {
        it('should get a game by id in O(1) time complexity', async () => {
            const game = await gamesManager
                .createGame(DIFFICULTY, MODE, HOST_USERNAME, 'getGameId');

            const retrievedGame = gamesManager.getGame(game.id);
            expect(retrievedGame.id).to.equal(game.id);
            expect(retrievedGame.difficulty).to.equal(DIFFICULTY);
            expect(retrievedGame.mode).to.equal(MODE);
        });

        it('should return undefined if the game does not exist', () => {
            expect(gamesManager.getGame('doesNotExist')).to.be.undefined;
        });
    });

    describe('joinGame()', () => {
        let game: MultiplayerCrosswordGame;
        const CHALLENGER_USERNAME = 'challenger';

        before(async () => {
            game = await gamesManager
                .createGame(DIFFICULTY, MODE, HOST_USERNAME, 'joinGameId');
        });

        it('should join an available game', () => {
            expect(
                gamesManager
                    .joinGame(game.id, CHALLENGER_USERNAME, 'joinGameChallengerId')
            ).to.be.true;
        });

        it('should not join an unavailable game', () => {
            expect(
                gamesManager
                    .joinGame(
                    'doesNotExist',
                    CHALLENGER_USERNAME,
                    'joinGameChallengerId'
                    )
            ).to.be.false;
        });

        it('should set the challenger username on the joined game', () => {
            expect(game.challengerUsername)
                .to.equal(CHALLENGER_USERNAME);
        });

        it('should remove the joined game from the list of available games', () => {
            expect(gamesManager.getAvailableGames()
                .filter((availableGame) => {
                    return availableGame.id === game.id;
                }).length).to.equal(0);
        });
    });

    describe('leaveGame()', () => {
        let game: MultiplayerCrosswordGame;
        const SOCKET_ID = 'leaveGameId';

        before(async () => {
            game = await gamesManager
                .createGame(DIFFICULTY, MODE, HOST_USERNAME, SOCKET_ID);
        });

        it('should remove the socket-game association', () => {
            expect(gamesManager.findGameIdBySocketId(SOCKET_ID))
                .to.equal(game.id);

            gamesManager.leaveGame(SOCKET_ID);

            expect(gamesManager.findGameIdBySocketId(SOCKET_ID))
                .to.be.undefined;
        });
    });

    describe('deleteGame()', () => {
        let game: MultiplayerCrosswordGame;
        const SOCKET_ID = 'deleteGameId';

        before(async () => {
            game = await gamesManager
                .createGame(DIFFICULTY, MODE, HOST_USERNAME, SOCKET_ID);
        });

        it('should stop tracking the deleted game', () => {
            expect(gamesManager.getGame(game.id).id)
                .to.equal(game.id);

            gamesManager.deleteGame(game.id);

            expect(gamesManager.getGame(game.id))
                .to.be.undefined;
        });
    });
});
