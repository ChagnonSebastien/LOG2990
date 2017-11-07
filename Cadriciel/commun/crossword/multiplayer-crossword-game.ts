import { Player } from './player';
import { Crossword } from './crossword';

export class MultiplayerCrosswordGame {
    public id: string;
    public difficulty: string;
    public mode: string;
    public player1: Player;
    public player2: Player;
    public crossword: Crossword;

    constructor(
        id: string,
        difficulty: string,
        mode: string,
        player1: Player,
        crossword: Crossword
    ) { }
}