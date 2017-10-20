import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LexiconService {
    constructor(private http: Http) { }

    public getWordDefinition(word: string, difficulty: string) {
       if (difficulty === 'easy') {
        return this.http.get('http://localhost:3000/api/definition/' + word).toPromise().
        then(res => res.json()[0]);
       } else {
        return this.http.get('http://localhost:3000/api/definition/' + word).toPromise().
        then(res => res.json()[(res.json().length > 1) ? 1 : 0]);
       }
    }
}
