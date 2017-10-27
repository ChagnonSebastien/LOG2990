import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {Track} from '../track';

const apiUrl = 'http://localhost:3000/api';
@Injectable()
export class TrackService {
    constructor(private http: Http) { }

    public deleteTrack(track: Track): Promise<string> {
        const path = 'track';
        return this.http
            .delete(`${apiUrl}/${path}/${track.name}`
        ).toPromise()
        .then(response => response.json().data)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}

