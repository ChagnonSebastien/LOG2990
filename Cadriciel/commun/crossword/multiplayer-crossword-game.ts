import { Player } from './player';
import { Crossword } from './crossword';
import { Countdown } from '../../server/app/crossword-multiplayer/countdown';

export class MultiplayerCrosswordGame {
    public id: string;
    public difficulty: string;
    public mode: string;
    public hostUsername: string;
    public challengerUsername: string;
    public crossword: Crossword;
    public countdown: Countdown;

    constructor(
        id: string,
        difficulty: string,
        mode: string,
        hostUsername: string,
        crossword: Crossword
    ) { 
        this.id = id;
        this.difficulty = difficulty;
        this.mode = mode;
        this.hostUsername = hostUsername;
        this.challengerUsername = '';
        this.crossword = crossword;
        this.countdown = new Countdown();
    }
}