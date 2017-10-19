import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Game } from '../../../../../commun/crossword/game';
@Injectable()
export class CrosswordGameInfoService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private collection = 'crosswords';
    public game: Game;
    constructor(private http: Http) {
        this.game = {
            id: '',
            difficulty: '',
            mode: '',
            option:  '',
            username1: '',
            username2: '',
            socketId1: '',
            socketId2: '',
            crossword: [[]],
            listOfWords: []
        };
    }
    public setCollection(collection: string): void {
        this.collection = collection;
    }

    public getCrossword(level: string) {
        console.log('here');
        if (level === 'easy' || level === 'normal' || level === 'hard') {
            return this.http.get('http://localhost:3000/api/crossword/' + this.collection + '/' + level).toPromise()
                .then(res => res.json());
        }
    }

    public async getGameInfo(): Promise<Game>  {
        if (this.game.option === 'SOLO') {
        await this.getCrossword(this.game.difficulty.toLowerCase()).then(res => {
            this.game.crossword = res.crossword;
            this.game.listOfWords = res.listOfWords;
         });
         return await this.game;
        } else {
             return this.getGameSettings();
        }
    }

    public getGameSettings(): Promise<Game> {
        return Promise.resolve(this.game);
    }
}
