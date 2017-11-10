import { expect } from 'chai';
import { CrosswordGameManager } from './crossword-games-manager';

describe('Game Manager', () => {
    const crosswordGameManager: CrosswordGameManager = new CrosswordGameManager;
    let createdGameId: string;

    it('Should create a game', (done) => {
        crosswordGameManager.createGame('easy', 'dynamic', 'testUser', 'testSocketId').then(game =>{
            expect(game.difficulty).to.equal('easy');
            expect(game.mode).to.equal('dynamic');
            expect(game.hostUsername).to.equal('testUser');
            expect(crosswordGameManager.findGameIdBySocketId('testSocketId')).to.equal(game.id);
            createdGameId = game.id;
            done();
        });
    });

    it('Should be able to join a game', () => {
        crosswordGameManager.joinGame(createdGameId, 'testUserOpponent', 'testSocketOpponent');
        expect(crosswordGameManager.getGame(createdGameId).challengerUsername).to.equal('testUserOpponent');
        expect(crosswordGameManager.findGameIdBySocketId('testSocketOpponent')).to.equal(createdGameId);
    });

});
