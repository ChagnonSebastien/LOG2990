import { expect } from 'chai';
import { CrosswordGamesManager } from './crossword-games-manager';
import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';

describe('#CrosswordGamesManager', () => {
    let gamesManager: CrosswordGamesManager;
    let gameId: string;
    const difficulty = 'easy';
    const mode = 'dynamic';
    const hostUsername = 'testUser';

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
        before(async () => {
            game = await gamesManager
                .createGame(difficulty, mode, hostUsername, 'createGameId');
        });

        it('should create a new multiplayer game', () => {
            expect(game.difficulty).to.equal(difficulty);
            expect(game.mode).to.equal(mode);
            expect(game.hostUsername).to.equal(hostUsername);
        });

        it('should store a new game for O(1) access by game id', () => {
            expect(gamesManager['gamesMap'].get(game.id).id).to.equal(game.id);
        });

        it('should store a new game as available to join', () => {
            expect(gamesManager['availableGames'].filter((availableGame) => {
                return game.id === availableGame.id;
            }).length).to.equal(1);
        });
    });

    describe('getAvailableGames()', () => {
        it('should return a list of available games', async () => {
            await gamesManager
                .createGame(difficulty, mode, hostUsername, 'getAvailableGamesId');

            expect(gamesManager.getAvailableGames().length).to.be.at.least(0);
            expect(gamesManager.getAvailableGames()[0].difficulty)
                .to.equal(difficulty);
            expect(gamesManager.getAvailableGames()[0].mode)
                .to.equal(mode);
        });
    });

    describe('getGame()', () => {
        it('should get a game by id in O(1) time complexity', async () => {
            const game = await gamesManager
                .createGame(difficulty, mode, hostUsername, 'getGameId');

            const retrievedGame = gamesManager.getGame(game.id);
            expect(retrievedGame.id).to.equal(game.id);
            expect(retrievedGame.difficulty).to.equal(difficulty);
            expect(retrievedGame.mode).to.equal(mode);
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
                .createGame(difficulty, mode, hostUsername, 'joinGameId');
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

    /*it('Should be able to delete a game', () => {
        expect(crosswordGameManager.getGame(createdGameId)).to.exist;
        crosswordGameManager.deleteGame(createdGameId);
        expect(crosswordGameManager.getGame(createdGameId)).to.not.exist;
        expect(crosswordGameManager.getGame(createdGameId)).to.be.undefined;
    });*/
});
