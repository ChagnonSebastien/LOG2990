import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

const apiUrl = 'http://localhost:3000/api';
@Injectable()
export class LexiconService {
    constructor(private http: Http) { }

    public getWordDefinition(word: string) {
        return this.http.get(`${apiUrl}/definition/${word}`)
            .toPromise()
            .then(res => res.json()[0]);
    }
}
