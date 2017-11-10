import { Injectable } from '@angular/core';

import { CrosswordSocketService } from '../socket/crossword-socket.service';
import { CrosswordPlayerService } from '../player/crossword-player.service';

import { CrosswordGameInfo } from '../../../../../commun/crossword/crossword-game-info';

@Injectable()
export class CrosswordLobbyService {
    public games: Array<CrosswordGameInfo>;
    private gamesMap: Map<string, CrosswordGameInfo>;

    constructor(
        private socketService: CrosswordSocketService,
        private playerService: CrosswordPlayerService
    ) {
        this.listenForActiveGames();
        this.getGames();
        setInterval(this.getGames.bind(this), 1000);
    }

    public joinGame(gameId: string): boolean {
        if (this.canJoinGame(gameId)) {
            this.socketService.socket.emit(
                'join game', gameId, this.playerService.username
            );
            return true;
        }
        return false;
    }

    public canJoinGame(gameId: string): boolean {
        if (this.playerService.username === '' || this.gamesMap === undefined) {
            return false;
        }
        const game = this.gamesMap.get(gameId);
        if (game !== undefined) {
            return game.challengerUsername === '';
        }

        return false;
    }

    private getGames(): void {
        this.socketService.socket.emit('get games');
    }

    private listenForActiveGames(): void {
        this.socketService.socket.on('sent all games', (games) => {
            this.games = games;
            this.gamesMap = this.constructGameMap(games);
        });
    }

    private constructGameMap(games: Array<CrosswordGameInfo>): Map<string, CrosswordGameInfo> {
        return games.reduce((map, game) => {
            map.set(game.id, game);
            return map;
        }, new Map<string, CrosswordGameInfo>());
    }
}
