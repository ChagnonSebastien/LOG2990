import { SocketServer } from '../socket-server';
import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';
import { CrosswordMutationManager } from './crossword-mutation-manager';
import { CrosswordGamesManager } from './crossword-games-manager';

import { Word } from '../../../commun/word';

export class CrosswordDynamicService {
    private static dynamicService: CrosswordDynamicService;

    private io: SocketIO.Server;
    private mutationManager: CrosswordMutationManager;
    private gamesManager: CrosswordGamesManager;

    private constructor() {
        this.io = SocketServer.getInstance();
        this.mutationManager = CrosswordMutationManager.getInstance();
        this.gamesManager = CrosswordGamesManager.getInstance();
    }

    // Singleton
    public static getInstance(): CrosswordDynamicService {
        if (this.dynamicService === undefined) {
            this.dynamicService = new CrosswordDynamicService();
        }
        return this.dynamicService;
    }

    public startDynamicGame(gameId: string, game: MultiplayerCrosswordGame): void {
        this.mutationManager.newGame(gameId, game.difficulty);
        game.countdown.count.subscribe((count: number) => {
            this.io.sockets.in(gameId).emit('current countdown', count);
        });
        game.countdown.startCountdown();
    }

    public foundWord(gameId: string, game: MultiplayerCrosswordGame, foundWord: Word): void {
        game.countdown.resetCountdown();
        this.mutationManager.foundWord(gameId, foundWord);
        this.io.sockets
            .in(gameId)
            .emit('update mutation', this.mutationManager.getNextMutation(gameId));
    }

    public listenForNewCountdown(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('new countdown', (newCountdown: number) => {
                console.log('NEW COUNTDOWN', newCountdown);
                const gameId = this.gamesManager.findGameIdBySocketId(socket.id);
                const game = this.gamesManager.getGame(gameId);
                if (game.mode === 'dynamic') {
                    game.countdown.initialCountdownValue = newCountdown;
                    game.countdown.resetCountdown();
                }
            });
        });
    }
}
