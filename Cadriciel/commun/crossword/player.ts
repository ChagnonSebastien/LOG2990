
export class Player {
    public username: string;
    public gameID: number;
    public score: number;
    public socketID: string;

    constructor() {
        this.username = '';
        this.gameID = -1;
        this.score = 0;
        this.socketID = '';
    }

    public getUsername(): string {
        return this.username;
    }

    public getGameID(): number {
        return this.gameID;
    }

    public getScore(): number {
        return this.score;
    }

    public getSocketID(): string{
        return this.socketID;
    }

    public setUsername(name: string): void {
        this.username = name;
    }

    public setGameID(gameID: number): void {
        this.gameID = gameID;
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public setSocketID(socket: string): void {
        this.socketID = socket;
    }
}
