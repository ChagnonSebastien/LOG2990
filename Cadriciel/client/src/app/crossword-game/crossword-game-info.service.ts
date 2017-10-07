import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CrosswordGameInfoService {
    constructor(private http: Http) { }
    public option: string = null;
    public mode: string = null;
    public level: string = null;

    public getOption() {
        return this.option;
    }

    public getMode() {
        return this.mode;
    }

    public getLevel() {
        return this.level;
    }

}
