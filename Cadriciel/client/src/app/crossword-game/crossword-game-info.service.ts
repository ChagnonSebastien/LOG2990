import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CrosswordGameInfoService {
    constructor(private http: Http) { }
    public option: string = null;
    public mode: string = null;
    public level: string = null;

    public getOption(): Promise<string>  {
        return Promise.resolve(this.option);
    }

    public getMode(): Promise<string> {
        return Promise.resolve(this.option);
    }

    public getLevel(): Promise<string> {
        return Promise.resolve(this.option);
    }

}
