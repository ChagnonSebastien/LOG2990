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
            socket.on('create game', (difficulty, mode, hostUsername) => {
                this.gameManager.createGame(difficulty, mode, hostUsername, socket.id)
                    .then((game) => {
                        socket.join(game.id);
                        this.io.sockets.in(game.id).emit('game created', game.id);
                    });
            });

            socket.on('get games', () => {
                socket.emit('sent all games', this.gameManager.getAvailableGames());
            });

            socket.on('join game', (gameId: string, challengerUsername: string) => {
                console.log(`${challengerUsername} has joined game ${gameId}`);
                const game = this.gameManager.getGame(gameId);
                if (game !== undefined) {
                    socket.join(gameId);
                    this.gameManager.joinGame(gameId, challengerUsername, socket.id);
                    this.io.sockets.in(gameId).emit('game started', game);
                    if (game.mode === 'dynamic') {
                        game.countdown.countdownAlerts().subscribe((count: number) => {
                            this.io.sockets.in(gameId).emit('current countdown', count);
                        });
                        game.countdown.startCountdown();
                    }
                }
            });


            socket.on('disconnect', () => {
                const roomId: string = this.gameManager.findGameIdBySocketId(socket.id);
                this.io.sockets.in(roomId).emit('opponent left');
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
                            const game = this.gameManager.getGame(roomId);
                            if (game.mode === 'dynamic') {
                                game.countdown.resetCountdown();
                            }
                            socket.broadcast.to(roomId)
                                .emit('opponent found a word', foundWord);
                        }
                    }
                }
            });

            socket.on('unselect all', () => {
                for (const roomId in socket.rooms) {
                    if (socket.rooms.hasOwnProperty(roomId)) {
                        if (roomId !== socket.id) {
                            socket.broadcast.to(roomId)
                                .emit('opponent unselected all');
                        }
                    }
                }
            });

            socket.on('leaveGame', () => {
                const roomId: string = this.gameManager.findGameIdBySocketId(socket.id);
                socket.leave(roomId);
                this.io.sockets.in(roomId).emit('opponent left');
                this.gameManager.deleteGame(roomId);
            });

            socket.on('new countdown', (newCountdown: number) => {
                for (const roomId in socket.rooms) {
                    if (socket.rooms.hasOwnProperty(roomId)) {
                        if (roomId !== socket.id) {
                            const game = this.gameManager.getGame(roomId);
                            if (game.mode === 'dynamic') {
                                game.countdown.initialCount = newCountdown;
                                game.countdown.resetCountdown();
                            }
                        }
                    }
                }
            });

        });

    }
}



