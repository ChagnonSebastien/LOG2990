import { Player } from '../../../commun/crossword/player';
import {GameManager} from './gameManager.service';
import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
  private sio: SocketIO.Server;
  private gameManager: GameManager;
 

  constructor(server: http.Server) {
    this.sio = io.listen(server);
    this.gameManager = new GameManager();
  }

  public handleSockets(): void {
    this.sio.on('connection', (socket) => {

      socket.on('createGame', (type: string, difficulty: string, mode: string, player1: Player) => {

          this.gameManager.createGame(type, difficulty, mode, player1).then( game => {
          socket.emit('gameCreated', game);
      });
    });

      socket.on('getGames', () => {
          socket.emit('sent all games', this.gameManager.getGames());

     });
      socket.on('i selected a word hint', () => {
        //this.sio.to(socketId).emit('opponent selected a grid sqaure', indexes);
      });
      socket.on('i found a word', () => {
        //this.sio.to(socketId).emit('opponent found a word', indexes);
      });
      socket.on('joinGame', (gameId: string, username: string) => {
        /*const index = this.findGameIndexById(gameId);
        if (index !== -1) {
          const currentGame = this.gamesList[index];
          currentGame.username2 = username;
          currentGame.socketId2 = socket.id;
          socket.emit('player 2 joined a game', currentGame);
          this.sio.to(currentGame.socketId1).emit('player 2 joined your game', currentGame);
      }*/
      });
    });

  }

}



