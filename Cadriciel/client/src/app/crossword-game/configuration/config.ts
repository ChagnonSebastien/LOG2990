export class Config {
    public type;
    public mode;
    public level;

    constructor(type: string, mode: string, level: string) {
        this.type = type;
        this.mode = mode;
        this.level = level;
    }
}
