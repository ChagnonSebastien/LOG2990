import { SocketServer } from '../socket-server';
import { CrosswordGamesManager } from './crossword-games-manager';
import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';
import { CrosswordDynamicService } from './crossword-dynamic-service';

export class CrosswordLobbyService {
    private static lobbyService: CrosswordLobbyService;
    private gameManager: CrosswordGamesManager;
    private io: SocketIO.Server;

    private constructor() {
        this.io = SocketServer.getInstance();
        this.gameManager = CrosswordGamesManager.getInstance();
    }

    // Singleton
    public static getInstance(): CrosswordLobbyService {
        if (this.lobbyService === undefined) {
            this.lobbyService = new CrosswordLobbyService();
        }
        return this.lobbyService;
    }

    public listenForLobbyRequests(): void {
        this.listenForCreateGame();
        this.listenForGetGames();
        this.listenForJoinGame();
        this.listenForLeaveGame();
        this.listenForRestartGame();
        this.listenForDisconnect();
    }

    private listenForCreateGame(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on(
                'create game',
                (difficulty: string, mode: string, hostUsername: string) => {
                    this.createGame(difficulty, mode, hostUsername, socket);
                });
        });
    }

    private async createGame(
        difficulty: string, mode: string, hostUsername: string, socket: SocketIO.Socket
    ): Promise<string> {
        let gameId: string;
        await this.gameManager
            .createGame(difficulty, mode, hostUsername, socket.id)
            .then((game: MultiplayerCrosswordGame) => {
                socket.join(game.id);
                gameId = game.id;
            });
        return gameId;
    }

    private listenForGetGames(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('get games', () => {
                socket.emit('sent all games', this.gameManager.getAvailableGames());
            });
        });
    }

    private listenForJoinGame(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('join game', (gameId: string, challengerUsername: string) => {
                this.leaveOtherGames(socket);
                this.joinGame(socket, gameId, challengerUsername);
            });
        });
    }

    private leaveOtherGames(socket: SocketIO.Socket): string {
        const otherJoinedGame = this.gameManager.findGameIdBySocketId(socket.id);
        if (otherJoinedGame !== undefined) {
            socket.leave(otherJoinedGame);
            this.gameManager.leaveGame(socket.id);
        }
        return otherJoinedGame;
    }

    private joinGame(socket: SocketIO.Socket, gameId: string, challengerUsername: string) {
        const game = this.gameManager.getGame(gameId);
        if (game !== undefined) {
            socket.join(gameId);
            this.gameManager.joinGame(gameId, challengerUsername, socket.id);
            this.startGame(gameId);
        }
    }

    private startGame(gameId: string): void {
        const game = this.gameManager.getGame(gameId);
        this.io.sockets.in(gameId).emit('game started', game);
        if (game.mode === 'dynamic') {
            CrosswordDynamicService
                .getInstance()
                .startDynamicGame(gameId, game);
        }
    }

    private listenForRestartGame(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on(
                'restart game',
                async (difficulty: string, mode: string, hostUsername: string) => {
                    const currentGameId = this.leaveOtherGames(socket);
                    const newGameId = await this.createGame(difficulty, mode, hostUsername, socket);
                    this.io.sockets.in(currentGameId).emit('opponent restarted game', newGameId);
                });
        });
    }

    private listenForDisconnect(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('disconnect', () => {
                this.io.sockets
                    .in(this.gameManager.findGameIdBySocketId(socket.id))
                    .emit('opponent left');
            });
        });
    }

    private listenForLeaveGame(): void {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            socket.on('leaveGame', () => {
                const gameId = this.gameManager.findGameIdBySocketId(socket.id);
                socket.leave(gameId);
                this.io.sockets.in(gameId).emit('opponent left');
                this.gameManager.leaveGame(socket.id);
                this.gameManager.deleteGame(gameId);
            });
        });
    }
}
