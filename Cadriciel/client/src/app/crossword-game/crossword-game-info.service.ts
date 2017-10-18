import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CrosswordGameInfoService {
    public game: Game;
    public option: string;
    constructor(private http: Http) {
        this.game = {
            id: '',
            difficulty: '',
            mode: '',
            username1: '',
            username2: '',
            socketId1: '',
            socketId2: '',
        };
     }

    public getOption(): Promise<string>  {
        return Promise.resolve(this.option);
    }

    public getMode(): Promise<string> {
        return Promise.resolve(this.game.mode);
    }

    public getLevel(): Promise<string> {
        return Promise.resolve(this.game.difficulty);
    }

}
interface Game {
    id: string;
    difficulty: string;
    mode: string;
    username1: string;
    username2: string;
    socketId1: string;
    socketId2: string;
 }
