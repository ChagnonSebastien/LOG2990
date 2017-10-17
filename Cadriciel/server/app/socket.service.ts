import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
  private sio: SocketIO.Server;
  public gameList: Game[] = [];

  constructor(server: http.Server) {
      this.sio = io.listen(server);
  }

  public handleSockets(): void {
    this.sio.on('connection', (socket) => {

      socket.on('createGame', (difficulty: string, mode: string, username: string) => {
             const gameId = (Math.random() + 1).toString(36).slice(2, 18);
             console.log(gameId);
             const game: Game = {
               id: gameId,
               difficulty: difficulty,
               mode: mode ,
               username1: username,
               username2: '',
             };
             this.gameList.push(game);
             this.sio.emit('gameCreated', game);
            });
    });

  }

 
 }




 interface Game{
  id: string;
  difficulty: string;
  mode: string;
  username1: string;
  username2: string;
}
