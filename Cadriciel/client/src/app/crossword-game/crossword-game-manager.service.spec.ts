import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { GameManagerService } from './crossword-game-manager.service';
import { GameManagerServicePlayer1 } from './crossword-game-manager-player1.service';
import { GameManagerServicePlayer2 } from './crossword-game-manager-player2.service';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';
import { Player } from '../../../../commun/crossword/player';
import { SocketIO, Server } from 'mock-socket';
//import * as io from 'socket.io-client';

//let gameManagerService1: GameManagerService;
//let gameManagerService2: GameManagerServicePlayer2;
//const HOST_NAME = 'http://' + window.location.hostname;
//const SERVER_PORT = ':3000';
//const clientSocket1: SocketIOClient.Socket = io.connect(HOST_NAME + SERVER_PORT, { forceNew: true });
//const clientSocket2: SocketIOClient.Socket = io.connect(HOST_NAME + SERVER_PORT, { forceNew: true });
//var SocketMock = require('socket-io-mock')
   // , should = require('chai').should();





   class MockSocketHandlerService extends SocketHandlerSerivce {
    public requestSocket(server: string): Promise<any> {
        const socket = io.connect('http://localhost:3000');
        return Promise.resolve('socket');
    }
}


describe('GameManagerService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                GameManagerService,
                { provide: SocketHandlerSerivce, useClass: MockSocketHandlerService },
                GameManagerServicePlayer1,
                GameManagerServicePlayer2
            ]
        });

    });

   /* it('basic test', (done) => {
        const mockServer = new Server('ws://localhost:3000');
        mockServer.on('connection', server => {
          mockServer.emit('game created', '0');
        });
        (window as any).io = SocketIO;
        const mock = new MockSocketHandlerService();
        gameManagerService1 = new GameManagerService(mock);
        setTimeout(() => {
          const id = gameManagerService1.getGame().id;
          expect(id === '-1').toBeFalsy();
          mockServer.stop(done);
        }, 900);
      });*/

    /*it('client 1 should be created', () => {
        expect(gameManagerService1).toBeDefined();
    });

    it('client 2 should be created', () => {
        expect(gameManagerService2).toBeDefined();
    });

    it('client 1 should be connected', () => {
        expect(gameManagerService1.connectionStatus()).toBeTruthy();
    });

    it('client 2 should be connected', () => {
        expect(gameManagerService2.connectionStatus()).toBeTruthy();
    });

    it('client 1 and 2 should have different connections', () => {
        expect(gameManagerService1.socket.id === gameManagerService2.socket.id).toBeFalsy();
    });*/

    /*it('test', (done) => {
        var socket = new SocketMock();
        ('game created', function (message) {
            expect(gameManagerService1.getGame().id === '1').toBeTruthy();
            done();
        });
        socket.emit('game created', '1');


    });

    /*it('client should be able to create a multiplayer game', (done) => {
        const player1 = new Player();
        player1.socketID = gameManagerService1.socket.id;
        gameManagerService1.createGame('multiplayer', 'easy', 'classic', player1);
        setTimeout(function () {
            expect(gameManagerService1.getGame().id === '-1').toBeFalsy();
            done();
        }, 2000);
    });*/

    /* it('client 2 should be able to join created game', (done) => {
         const player1 = new Player();
         player1.socketID = gameManagerService1.socket.id;
         gameManagerService1.createGame('multiplayer', 'easy', 'classic', player1);
         setTimeout(function () {
             const player2 = new Player();
             player2.socketID = gameManagerService2.socket.id;
             gameManagerService2.joinGame(gameManagerService1.getGame().id, player2);
             expect(gameManagerService1.getGame().option).toEqual('multiplayer');
             done();
         }, 1000);
     });*/

});
