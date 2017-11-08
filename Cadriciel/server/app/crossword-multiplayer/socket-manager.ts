import { CrosswordGameManager } from './crossword-games-manager';
import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
    private io: SocketIO.Server;
    private gameManager: CrosswordGameManager;

    constructor(server: http.Server) {
        this.io = io.listen(server);
        this.gameManager = new CrosswordGameManager();
    }

    public handleSocketRequests(): void {
        this.io.on('connect', (socket) => {
            console.log('SOCKET CONNECTED', socket.id);

            socket.on('create game', (difficulty, mode, hostUsername) => {
                this.gameManager.createGame(difficulty, mode, hostUsername)
                    .then((game) => {
                        console.log('GAME CREATED');
                        socket.join(game.id);
                        this.io.sockets.in(game.id).emit('game created', game.id);
                    });
            });

            socket.on('get games', () => {
                console.log('SENT GAMES');
                socket.emit('sent all games', this.gameManager.getGames());
            });

            socket.on('join game', (gameId: string, challengerUsername: string) => {
                console.log(`${challengerUsername} has joined game ${gameId}`);
                socket.join(gameId);
                const game = this.gameManager.getGame(gameId);
                game.challengerUsername = challengerUsername;
                this.io.sockets.in(gameId).emit('game started', game);
            });

            socket.on('selected hint', (hintSelection) => {
                for (const roomId in socket.rooms) {
                    if (socket.rooms.hasOwnProperty(roomId)) {
                        if (roomId !== socket.id) {
                            socket.broadcast.to(roomId)
                                .emit('opponent selected a hint', hintSelection);
                        }
                    }
                }
            });

            socket.on('found word', (foundWord) => {
                for (const roomId in socket.rooms) {
                    if (socket.rooms.hasOwnProperty(roomId)) {
                        if (roomId !== socket.id) {
                            socket.broadcast.to(roomId)
                                .emit('opponent found a word', foundWord);
                        }
                    }
                }
            });

            /*socket.on('joinGame', (gameId: string, player: Player) => {
                socket.join(gameId);
                this.io.sockets.in(gameId).emit('player 2 joined', this.gameManager.joinGame(gameId, player));
            });

            socket.on('disconnect', () => {
                // socket.broadcast.to(socket.rooms[0]).emit('opponent left');
                const room: string = this.gameManager.findGameIdBySocketId(socket.id);
                this.io.sockets.in(room).emit('opponent left');
            });

            socket.on('found a word', () => {
                // send found word
            });
            socket.on('selected a hint', () => {
                // send foud hint
            });*/

        });

    }

}



