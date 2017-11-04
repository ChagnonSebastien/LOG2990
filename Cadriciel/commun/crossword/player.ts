
export class Player {
    public username: string;
    public usernameValid: boolean;
    public gameID: number;
    public score: number;
    public socketID: string;

    constructor() {
        this.username = '';
        this.usernameValid = false;
        this.gameID = -1;
        this.score = 0;
        this.socketID = '';
    }

    public getUsername(): string {
        return this.username;
    }

    public getNameValid(): boolean {
        return this.usernameValid;
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

    public setNameValid(nameValid: boolean): void {
        this.usernameValid = nameValid;
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
