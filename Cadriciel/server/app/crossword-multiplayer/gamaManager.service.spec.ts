import { expect } from 'chai';
import { Player } from '../../../commun/crossword/player';
import { GameManager } from './gameManager.service';

describe('Game Manager', () => {
    const chai = require('chai');
    const gameManager: GameManager = new GameManager;
    let createdGameId: string;

    it('Create a game', (done) => {
        const player: Player = new Player();
        gameManager.createGame('multiplayer', 'easy', 'dynamic', player ).then(game => {
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
    });

   /* it('Should change password when walleandtomato is entered', (done) => {

    });

    it('Should not change password when a password other than walleandtomato is entered', (done) => {

    });*/
});
