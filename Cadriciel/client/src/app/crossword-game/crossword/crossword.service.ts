import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const apiUrl = 'http://localhost:3000/api/crossword';
const collection = 'crosswords';

@Injectable()
export class CrosswordService {
    constructor(private http: Http) { }

    public getCrossword(level: string): Promise<any> {
        return this.http.get(`${apiUrl}/${collection}/${level}`)
            .toPromise()
            .then(crossword => crossword.json());
    }
}
