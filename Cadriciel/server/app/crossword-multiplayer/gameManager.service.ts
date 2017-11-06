import { Game } from '../../../commun/crossword/Game';
import { Player } from '../../../commun/crossword/player';
import { ClientGameInfo } from '../../../commun/crossword/clientGameInfo';
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
        const gamesInfo: ClientGameInfo[] = [];
        this.games.forEach((game, index) => {
            const gameInfo = new ClientGameInfo(game.id, game.player1.username, game.difficulty,
                game.mode, game.option, game.player2.username);
            gamesInfo.push(gameInfo);
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

    public findGameIdBySocketId(id: string): string {
        for (let i = 0; i < this.games.length; i++) {
            if (this.games[i].player1.socketID === id || this.games[i].player2.socketID === id) {
                return this.games[i].id;
            }
        }
        return '-1';
    }
}
