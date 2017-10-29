import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

const APIURL = 'http://localhost:3000/api';
@Injectable()
export class LexiconService {
    constructor(private http: Http) { }

    public getWordDefinitions(words: Array<string>): Observable<any> {
        return Observable.forkJoin(
            words.map((word) => {
                return this.http.get(`${APIURL}/definition/${word}`)
                    .map(res => res.json()[0]);
            })
        );
    }
}
