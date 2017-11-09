import { Injectable } from '@angular/core';

import { CrosswordSocketService } from '../socket/crossword-socket.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';

import { CrosswordGameInfo } from '../../../../../commun/crossword/crossword-game-info';

@Injectable()
export class CrosswordLobbyService {
    public games: Array<CrosswordGameInfo>;

    constructor(
        private socketService: CrosswordSocketService,
        private playerService: CrosswordPlayerService
    ) {
        this.listenForActiveGames();
        setInterval(this.getGames.bind(this), 1000);
    }

    private getGames() {
        this.socketService.socket.emit('get games');
    }

    private listenForActiveGames() {
        this.socketService.socket.on('sent all games', (games) => {
            this.games = games;
        });
    }

    public joinGame(gameId: string) {
        this.socketService.socket.emit(
            'join game', gameId, this.playerService.username
        );
    }
}
