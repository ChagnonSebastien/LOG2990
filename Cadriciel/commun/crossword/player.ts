
export class Player {
    private username: string;
    private usernameValid: boolean;
    private gameID: number;
    private score: number;
    private socket: any;

    constructor() {
        this.username = '';
        this.usernameValid = false;
        this.gameID = -1;
        this.score = 0;
        this.socket = null;
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

    public getSocket(): any{
        return this.socket;
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

    public setSocket(socket: any): void {
        this.socket = socket;
    }
}
