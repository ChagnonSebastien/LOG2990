import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CrosswordService {
    constructor(private http: Http) { }
    private headers = new Headers({'Content-Type': 'application/json'});
    private collection = 'crosswords';

    public setCollection(collection: string): void {
        this.collection = collection;
    }

    public getCrossword(level: string) {
        if (level === 'easy' || level === 'normal' || level === 'hard') {
            return this.http.get('http://localhost:3000/api/crossword/' + this.collection + '/' + level).toPromise()
                .then(res => res.json());
        }
    }

}
