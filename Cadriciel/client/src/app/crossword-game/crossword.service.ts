import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const apiUrl = 'http://localhost:3000/api/crossword';
const collection = 'crosswords';

@Injectable()
export class CrosswordService {
    constructor(private http: Http) { }

    public getCrossword(level: string) {
        return this.http.get(`${apiUrl}/${collection}/${level}`)
            .toPromise()
            .catch(err => this.handleError(err))
            .then(crossword => crossword.json());
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
