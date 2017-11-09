import { MultiplayerCrosswordGame } from '../../../commun/crossword/multiplayer-crossword-game';
import { ServerCrosswords } from '../crosswordGrid/serverCrosswords';

export class CrosswordGameManager {
    private games: Array<MultiplayerCrosswordGame>;
    private gamesMap: Map<string, MultiplayerCrosswordGame>;
    private idCounter: number;
    private serverCrosswords: ServerCrosswords;

    constructor() {
        this.games = new Array<MultiplayerCrosswordGame>();
        this.gamesMap = new Map<string, MultiplayerCrosswordGame>();
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

    public async createGame(difficulty: string, mode: string, hostUsername: string): Promise<MultiplayerCrosswordGame> {
        let game: MultiplayerCrosswordGame;
        await this.serverCrosswords.getCrossword(difficulty).then((crossword) => {
            game = new MultiplayerCrosswordGame(
                this.generateGameId(), difficulty, mode, hostUsername, crossword
            );
            this.games.push(game);
            this.gamesMap.set(game.id, game);
        });
        return game;
    }

    public getGame(id: string): MultiplayerCrosswordGame {
        return this.gamesMap.get(id);
    }

    /*public joinGame(gameId: string, player: Player): MultiplayerCrosswordGame {
        const game = this.findGameById(gameId);
        game.player2 = player;
        return game;
    }

    public findGameById(id: string): MultiplayerCrosswordGame {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].id === id) {
                return this.games[i];
            }
        }
        return null;
    }

    public findGameIdBySocketId(id: string): string {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].player1.socketID === id || this.games[i].player2.socketID === id) {
                return this.games[i].id;
            }
        }
        return '-1';
    }*/

    private generateGameId(): string {
        return (this.idCounter++).toString();
    }
}
