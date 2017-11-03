import { Game } from '../../commun/crossword/game';
import { ServerCrosswords } from './crosswordGrid/serverCrosswords';
import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
  private sio: SocketIO.Server;
  public gamesList: Game[] = [];
  private serverCrosswords: ServerCrosswords;
  constructor(server: http.Server) {
    this.sio = io.listen(server);
    this.serverCrosswords = ServerCrosswords.getInstance();
    this.serverCrosswords.setCollection('crosswords');
  }

  public handleSockets(): void {
    this.sio.on('connection', (socket) => {
/*
      socket.on('createGame', (difficulty: string, mode: string, username: string) => {
        this.serverCrosswords.getCrossword(difficulty.toLowerCase()).then(crossword => {
          const game: Game = {
            id: (Math.random() + 1).toString(36).slice(2, 18),
            difficulty: difficulty,
            mode: mode,
            option: 'MULTIPLAYER',
            username1: username,
            username2: '',
            socketId1: socket.id,
            socketId2: '',
            crossword: crossword.crossword,
            listOfWords: crossword.listOfWords
          };
          this.gamesList.push(game);
          socket.emit('gameCreated', game);
        });
      });
      socket.on('getGames', () => {
        socket.emit('allGames', this.gamesList);
      });
      socket.on('i selected a word hint', (indexes: Index[], socketId: string) => {
        this.sio.to(socketId).emit('opponent selected a grid sqaure', indexes);
      });
      socket.on('i found a word', (indexes: Index[], socketId: string) => {
        this.sio.to(socketId).emit('opponent found a word', indexes);
      });
      socket.on('joinGame', (gameId: string, username: string) => {
        const index = this.findGameIndexById(gameId);
        if (index !== -1) {
          const currentGame = this.gamesList[index];
          currentGame.username2 = username;
          currentGame.socketId2 = socket.id;
          socket.emit('player 2 joined a game', currentGame);
          this.sio.to(currentGame.socketId1).emit('player 2 joined your game', currentGame);
        }
      });*/
    });

  }

 /* public findGameIndexById(id: string): number {
    for (let i = 0; i < this.gamesList.length; i++) {
      if (this.gamesList[i].id === id) {
        return i;
      }
    }
    return -1;
  }*/
}

/***********************************************************
* Interface used for the positon of a crossword grid
***************************************************************/
interface Index {
  i: number;
  j: number;
}


