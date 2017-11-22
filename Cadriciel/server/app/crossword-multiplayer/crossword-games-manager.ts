import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';
import { CrosswordGameInfo } from '../../../commun/crossword/crossword-game-info';
import { ServerCrosswords } from '../crosswordGrid/serverCrosswords';

import { INITIAL_GAME_ID } from '../config';

export class CrosswordGamesManager {
    private static gameManagerInstance: CrosswordGamesManager;
    private availableGames: Array<MultiplayerCrosswordGame>;
    private gamesMap: Map<string, MultiplayerCrosswordGame>;
    private socketsInGames: Map<string, string>;
    private gameIdCounter: number;
    private serverCrosswords: ServerCrosswords;

    // Singleton : use getInstance()
    private constructor() {
        this.availableGames = new Array<MultiplayerCrosswordGame>();
        this.gamesMap = new Map<string, MultiplayerCrosswordGame>();
        this.socketsInGames = new Map<string, string>();
        this.gameIdCounter = INITIAL_GAME_ID;
        this.serverCrosswords = ServerCrosswords.getInstance();
        this.serverCrosswords.setCollection('crosswords');
    }

    public static getInstance(): CrosswordGamesManager {
        if (this.gameManagerInstance === undefined) {
            this.gameManagerInstance = new CrosswordGamesManager();
        }
        return this.gameManagerInstance;
    }

    public getAvailableGames(): Array<CrosswordGameInfo> {
        return this.availableGames
            .map((game: MultiplayerCrosswordGame) => {
                return new CrosswordGameInfo(
                    game.id,
                    game.hostUsername,
                    game.difficulty,
                    game.mode,
                    game.challengerUsername
                );
            });
    }

    public async createGame(difficulty: string, mode: string, hostUsername: string, socketId: string): Promise<MultiplayerCrosswordGame> {
        const id: string = this.generateGameId();
        const crossword = await this.serverCrosswords.getCrossword(difficulty);
        const game = new MultiplayerCrosswordGame(id, difficulty, mode, hostUsername, crossword);
        this.availableGames.push(game);
        this.gamesMap.set(game.id, game);
        this.socketsInGames.set(socketId, id);
        return game;
    }

    public getGame(id: string): MultiplayerCrosswordGame {
        return this.gamesMap.get(id);
    }

    public joinGame(gameId: string, challengerUsername: string, socketId: string): boolean {
        const game = this.gamesMap.get(gameId);
        if (game === undefined) {
            return false;
        }
        game.challengerUsername = challengerUsername;
        this.socketsInGames.set(socketId, gameId);
        this.deleteAvailableGame(game);
        return true;
    }

    public leaveGame(socketId: string): void {
        this.socketsInGames.delete(socketId);
    }

    public findGameIdBySocketId(id: string): string {
        return this.socketsInGames.get(id);
    }

    public deleteGame(id: string) {
        this.gamesMap.delete(id);
    }

    private generateGameId(): string {
        return (this.gameIdCounter++).toString();
    }

    private deleteAvailableGame(game: MultiplayerCrosswordGame): void {
        this.availableGames = this.availableGames
            .filter((availableGame: MultiplayerCrosswordGame) => {
                return availableGame !== game;
            });
    }
}
