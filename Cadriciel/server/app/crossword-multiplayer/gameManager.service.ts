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

    public getGames(): Game[] {
        return this.games;
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
                player2: null,
                crossword: crossword.crossword,
                listOfWords: crossword.listOfWords
            };
            this.idCounter++;
            this.games.push(game);
        });
        return await game;
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
