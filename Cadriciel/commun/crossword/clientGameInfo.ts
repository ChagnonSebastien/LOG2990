export class ClientGameInfo {
    id: string;
    hostPlayerName: string;
    difficulty: string;
    mode: string;
    username2: string;

    constructor(id: string, hostPlayerName: string, difficulty: string, mode: string, username2: string) {
        this.id = id;
        this.hostPlayerName = hostPlayerName;
        this.difficulty = difficulty;
        this.mode = mode;
        this.username2 = username2;
    }
}