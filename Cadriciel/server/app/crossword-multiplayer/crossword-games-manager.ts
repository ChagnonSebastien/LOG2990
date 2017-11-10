import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';
import { ServerCrosswords } from '../crosswordGrid/serverCrosswords';

export class CrosswordGameManager {
    private games: Array<MultiplayerCrosswordGame>;
    private gamesMap: Map<string, MultiplayerCrosswordGame>;
    private socketsInGames: Map<string, string>;
    private idCounter: number;
    private serverCrosswords: ServerCrosswords;

    constructor() {
        this.games = new Array<MultiplayerCrosswordGame>();
        this.gamesMap = new Map<string, MultiplayerCrosswordGame>();
        this.socketsInGames = new Map<string, string>();
        this.idCounter = 0;
        this.serverCrosswords = ServerCrosswords.getInstance();
        this.serverCrosswords.setCollection('crosswords');
    }

    public getGames() {
        return this.games.map((game) => {
            return {
                id: game.id,
                difficulty: game.difficulty,
                mode: game.mode,
                hostUsername: game.hostUsername,
                challengerUsername: game.challengerUsername
            };
        });
    }

    public async createGame(difficulty: string, mode: string, hostUsername: string, socketId: string): Promise<MultiplayerCrosswordGame> {
        let game: MultiplayerCrosswordGame;
        const id: string = this.generateGameId();
        await this.serverCrosswords.getCrossword(difficulty).then((crossword) => {
            game = new MultiplayerCrosswordGame(
                id, difficulty, mode, hostUsername, crossword
            );
            this.games.push(game);
            this.gamesMap.set(game.id, game);
            this.socketsInGames.set(socketId, id);
        });
        return game;
    }

    public getGame(id: string): MultiplayerCrosswordGame {
        return this.gamesMap.get(id);
    }

    public joinGame(gameId: string, challengerUsername: string, socketId: string): void {
        const game = this.getGame(gameId);
        game.challengerUsername = challengerUsername;
        this.socketsInGames.set(socketId, gameId);
    }

    public findGameIdBySocketId(id: string): string {
        return this.socketsInGames.get(id);
    }

    public deleteGame(id: string) {
        this.gamesMap.delete(id);
    }

    private generateGameId(): string {
        return (this.idCounter++).toString();
    }
}
