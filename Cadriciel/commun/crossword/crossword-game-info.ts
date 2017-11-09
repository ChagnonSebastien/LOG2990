export class CrosswordGameInfo {
    id: string;
    hostUsername: string;
    difficulty: string;
    mode: string;
    challengerUsername: string;

    constructor(id: string, hostUsername: string, difficulty: string, mode: string, challengerUsername: string) {
        this.id = id;
        this.hostUsername = hostUsername;
        this.difficulty = difficulty;
        this.mode = mode;
        this.challengerUsername = challengerUsername;
    }
}