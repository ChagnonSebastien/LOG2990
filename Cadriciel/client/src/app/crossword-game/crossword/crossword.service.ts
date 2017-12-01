import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { Word } from '../../../../../commun/word';

const api = 'http://localhost:3000/api';
const collection = 'crosswords';

@Injectable()
export class CrosswordService {
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    public getCrossword(level: string): Promise<any> {
        return this.http.get(`${api}/crossword/${collection}/${level}`)
            .toPromise()
            .then(crossword => crossword.json());
    }

    public getMutatedCrossword(level: string, foundWords: Array<Word>): Promise<any> {
        return this.http.post(
            `${api}/mutate`,
            JSON.stringify({
                'level': level,
                'wordsWithIndex': foundWords
            }),
            { headers: this.headers }
        ).toPromise().then((data) => {
            return data.json().crossword;
        });
    }
}
