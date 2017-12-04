import { SocketServer } from '../socket-server';
import { CrosswordGamesManager } from './crossword-games-manager';

import { HintSelection } from '../../../commun/crossword/hint-selection';
import { Word } from '../../../commun/word';
import { CrosswordDynamicService } from './crossword-dynamic-service';

export class CrosswordGameplayService {
    private static gameplayService: CrosswordGameplayService;
    private dynamicService: CrosswordDynamicService;
    private io: SocketIO.Server;
    private gameManager: CrosswordGamesManager;

    private constructor() {
        this.dynamicService = CrosswordDynamicService.getInstance();
        this.io = SocketServer.getInstance();
        this.gameManager = CrosswordGamesManager.getInstance();
    }

    public static getInstance(): CrosswordGameplayService {
        if (this.gameplayService === undefined) {
            this.gameplayService = new CrosswordGameplayService();
        }
        return this.gameplayService;
    }

    public listenForGameplayRequests(): void {
        this.listenForSelectedHint();
        this.listenForFoundWord();
        this.listenForUnselectAll();
        this.dynamicService.listenForNewCountdown();
    }

    private listenForSelectedHint(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('selected hint', (hintSelection: HintSelection) => {
                const gameId = this.gameManager.findGameIdBySocketId(socket.id);
                socket.broadcast.to(gameId)
                    .emit('opponent selected a hint', hintSelection);
            });
        });
    }

    private listenForFoundWord(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('found word', (foundWord: Word) => {
                const gameId = this.gameManager.findGameIdBySocketId(socket.id);
                socket.broadcast.to(gameId)
                    .emit('opponent found a word', foundWord);
                const game = this.gameManager.getGame(gameId);
                if (game.mode === 'dynamic') {
                    this.dynamicService.foundWord(gameId, game, foundWord);
                }
            });
        });
    }

    private listenForUnselectAll(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('unselect all', () => {
                const gameId = this.gameManager.findGameIdBySocketId(socket.id);
                socket.broadcast.to(gameId)
                    .emit('opponent unselected all');
            });
        });
    }
}
