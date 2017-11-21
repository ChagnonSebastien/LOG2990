import { expect } from 'chai';
import { CrosswordGameManager } from './crossword-games-manager';

describe('Game Manager', () => {
    const crosswordGameManager: CrosswordGameManager = CrosswordGameManager.getInstance();
    let createdGameId: string;

    it('Should create a game', (done) => {
        crosswordGameManager.createGame('easy', 'dynamic', 'testUser', 'testSocketId').then(game => {
            expect(game.difficulty).to.equal('easy');
            expect(game.mode).to.equal('dynamic');
            expect(game.hostUsername).to.equal('testUser');
            expect(crosswordGameManager.findGameIdBySocketId('testSocketId')).to.equal(game.id);
            createdGameId = game.id;
            done();
        });
    });

    it('Should be able to get available games info', () => {
        expect(crosswordGameManager.getAvailableGames().length).to.equal(1);
    });

    it('Should be able to join a game', () => {
        crosswordGameManager.joinGame(createdGameId, 'testUserOpponent', 'testSocketOpponent');
        expect(crosswordGameManager.getGame(createdGameId).challengerUsername).to.equal('testUserOpponent');
        expect(crosswordGameManager.findGameIdBySocketId('testSocketOpponent')).to.equal(createdGameId);
    });

    it('Should be no available games after player 2 joins the created game', () => {
        expect(crosswordGameManager.getAvailableGames().length).to.equal(0);
    });

    it('Should be able to delete a game', () => {
        expect(crosswordGameManager.getGame(createdGameId)).to.exist;
        crosswordGameManager.deleteGame(createdGameId);
        expect(crosswordGameManager.getGame(createdGameId)).to.not.exist;
        expect(crosswordGameManager.getGame(createdGameId)).to.be.undefined;
    });
});
