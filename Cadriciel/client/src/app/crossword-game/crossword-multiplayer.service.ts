import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MultiplayerCrosswordGame } from '../../../../commun/crossword/multiplayer-crossword-game';
import { Player } from '../../../../commun/crossword/player';
import { CrosswordSocketService } from './crossword-socket.service';
import { ClientGameInfo } from '../../../../commun/crossword/clientGameInfo';

@Injectable()
export class CrosswordMultiplayerService {
    public socket: SocketIOClient.Socket;
    public game: MultiplayerCrosswordGame;
    protected readonly HOST_NAME = `http://${window.location.hostname}`;
    protected readonly SERVER_PORT = '3000';

    constructor(protected socketService: CrosswordSocketService) {
        this.socketService.requestSocket(`${this.HOST_NAME}/${this.SERVER_PORT}`).then(socket => {
            this.socket = socket;

            this.socket.on('player 2 joined', data => {
                this.game = data;
            });

            this.socket.on('game created', data => {
                this.game.id = data;
            });

            this.socket.on('opponent left', data => {
                alert('Your opponent left the game');
                this.leaveGame();
            });
        });
    }

    public getGame(): MultiplayerCrosswordGame {
        return this.game;
    }

    public createGame(type: string, difficulty: string, mode: string, player1: Player) {
        this.socket.emit('createGame', type, difficulty, mode, player1);
    }
    public leaveGame() {
        this.socket.emit('leaveGame', this.game.id);
    }

    public getGames(): Promise<ClientGameInfo[]> {
        this.socket.emit('getGames');
        const gamesPromise = new Promise<ClientGameInfo[]>(
            (res, rej) => this.socket.on('sent all games', data => res(data)));
        return gamesPromise;
    }

    public joinGame(gameId: string, player: Player) {
        this.socket.emit('joinGame', gameId, player);
    }

    public connectionStatus() {
        return this.socket !== undefined;
    }
}
