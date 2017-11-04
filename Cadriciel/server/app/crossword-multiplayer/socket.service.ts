import { Player } from '../../../commun/crossword/player';
import { GameManager } from './gameManager.service';
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

                this.gameManager.createGame(type, difficulty, mode, player1).then(game => {
                    socket.emit('gameCreated', game);
                });
            });
            socket.on('getGames', () => {
                socket.emit('sent all games', this.gameManager.getGames());
            });

            socket.on('joinGame', (gameId: string, player: Player) => {
                this.sio.to(player.socketID).emit('player 2 joined', this.gameManager.joinGame(gameId, player));
                const player1SocketID: string = this.gameManager.findGameById(gameId).player1.socketID;
                this.sio.to(player1SocketID).emit('player 2 joined', this.gameManager.findGameById(gameId));
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



