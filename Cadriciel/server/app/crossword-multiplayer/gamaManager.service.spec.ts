import { expect } from 'chai';
import { Player } from '../../../commun/crossword/player';
import { GameManager } from './gameManager.service';

describe('Game Manager', () => {
    const gameManager: GameManager = new GameManager;
    let createdGameId: string;

    it('Create a game', (done) => {
        const player: Player = new Player();
        gameManager.createGame('multiplayer', 'easy', 'dynamic', player).then(game => {
            expect(game.difficulty).to.equal('easy');
            expect(game.mode).to.equal('dynamic');
            expect(game.option).to.equal('multiplayer');
            createdGameId = game.id;
            done();
        });
    });

    it('Should be able to join a game', () => {
        const player: Player = new Player();
        player.username = 'tester';
        expect(gameManager.joinGame(createdGameId, player).player2.username).to.equal('tester');
        expect(player.gameID).to.equal(createdGameId);
    });

     it('Should be able to get game by id', () => {
        expect(gameManager.findGameById(createdGameId).id).to.equal(createdGameId);
     });

     it('Should be able to get created games info', () => {
        expect(gameManager.getGames().length).to.greaterThan(0);
     });

     it('Should be be able to delete a created game', () => {
        gameManager.deleteGame(createdGameId);
        expect(gameManager.getGames().length).to.equal(0);
     });
});
