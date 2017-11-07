import { Player } from '../../../commun/crossword/player';
import { CrosswordGameManager } from './crossword-games-manager';
import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
    private sio: SocketIO.Server;
    private gameManager: CrosswordGameManager;


    constructor(server: http.Server) {
        this.sio = io.listen(server);
        this.gameManager = new CrosswordGameManager();
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {

            socket.on('createGame', (type: string, difficulty: string, mode: string, player1: Player) => {
                this.gameManager.createGame(type, difficulty, mode, player1)
                    .then((game) => {
                        socket.join(game.id);
                        this.sio.sockets.in(game.id).emit('game created', game.id);
                    });
            });

            socket.on('getGames', () => {
                socket.emit('sent all games', this.gameManager.getGames());
            });

            socket.on('joinGame', (gameId: string, player: Player) => {
                socket.join(gameId);
                this.sio.sockets.in(gameId).emit('player 2 joined', this.gameManager.joinGame(gameId, player));
            });

            socket.on('disconnect', () => {
                // socket.broadcast.to(socket.rooms[0]).emit('opponent left');
                const room: string = this.gameManager.findGameIdBySocketId(socket.id);
                this.sio.sockets.in(room).emit('opponent left');
            });

            socket.on('found a word', () => {
                // send found word
            });
            socket.on('selected a hint', () => {
                // send foud hint
            });

        });

    }

}



