import { Game } from '../../../commun/crossword/Game';
import { Player } from '../../../commun/crossword/player';
import { ServerCrosswords } from '../crosswordGrid/serverCrosswords';

export class GameManager {

    private games: Game[];
    private idCounter: number;
    private serverCrosswords: ServerCrosswords;

    constructor() {
        this.games = [];
        this.idCounter = 0;
        this.serverCrosswords = ServerCrosswords.getInstance();
        this.serverCrosswords.setCollection('crosswords');
    }

    public getGames(): { id: string, playerHost: string, difficulty: string, mode: string, username2: string }[] {
        const gamesInfo: { id: string, playerHost: string, difficulty: string, mode: string, username2: string }[] = [];
        this.games.forEach((game, index) => {
            gamesInfo.push({
                id: game.id, playerHost: game.player1.username,
                difficulty: game.difficulty, mode: game.mode, username2: game.player2.username
            });
        });
        return gamesInfo;
    }

    public async createGame(type: string, difficulty: string, mode: string, player1: Player): Promise<Game> {
        let game: Game;
        await this.serverCrosswords.getCrossword(difficulty.toLowerCase()).then(crossword => {
            game = {
                id: this.idCounter.toString(),
                difficulty: difficulty,
                mode: mode,
                option: type,
                player1: player1,
                player2: new Player(),
                crossword: crossword
            };
            this.idCounter++;
            this.games.push(game);
        });
        return await game;
    }

    public joinGame(gameId: string, player: Player): Game {
        const game = this.findGameById(gameId);
        game.player2 = player;
        return game;
    }

    public findGameById(id: string): Game {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].id === id) {
                return this.games[i];
            }
        }
        return null;
    }
}
