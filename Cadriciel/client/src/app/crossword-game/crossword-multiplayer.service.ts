import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CrosswordSocketService } from './crossword-socket.service';
import { CrosswordPlayerService } from './crossword-player.service';

import { Player } from '../../../../commun/crossword/player';
import { CrosswordGameInfo } from '../../../../commun/crossword/crossword-game-info';
import { MultiplayerCrosswordGame } from '../../../../commun/crossword/multiplayer-crossword-game';

@Injectable()
export class CrosswordMultiplayerService {
    public games: Array<CrosswordGameInfo>;
    public game: MultiplayerCrosswordGame;

    constructor(
        private socketService: CrosswordSocketService,
        private playerService: CrosswordPlayerService
    ) {
        setInterval(this.getGames.bind(this), 500);
        this.listenForActiveGames();
    }

    public createGame(difficulty: string, mode: string) {
        this.socketService.socket.emit(
            'create game', difficulty, mode, this.playerService.username
        );
    }

    public getGames() {
        this.socketService.socket.emit('get games');
    }

    private listenForActiveGames() {
        this.socketService.socket.on('sent all games', (games) => {
            this.games = games;
        });
    }

    /*constructor(private socketService: CrosswordSocketService) {
        this.socketService.requestSocket().then(socket => {
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
    }*/
}
