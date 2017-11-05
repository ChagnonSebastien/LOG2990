export class ClientGameInfo {
    id: string;
    playerHost: string;
    difficulty: string;
    mode: string;
    option: string;
    username2: string;

    constructor(id: string, playerHost: string, difficulty: string, mode:string, option:string, username2: string) {
        this.id = id;
        this.playerHost= playerHost;
        this.difficulty = difficulty;
        this.mode = mode;
        this.option = option;
        this.username2 = username2;
    }
}