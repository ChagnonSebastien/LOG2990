import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TrackService {
    constructor(private http: Http) { }

    public deleteTrack(id) {
        return this.http.delete('http://localhost:3000/api/track/' + id).map(res => res.json());
    }

    public changeTrackType(id: String, newType: String) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const information = {
            'id': id,
            'newType': newType
        };

        return this.http.put('http://localhost:3000/api/tracksTypeChange', information, { headers: headers }).map(res => res.json());
    }



    public changeTrackDescription(id: String, newDesc: String) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const information = {
            'id': id,
            'newDesc': newDesc
        };

        return this.http.put('http://localhost:3000/api/tracksDescChange', information, { headers: headers }).map(res => res.json());
    }



    public changeTrackName(id: String, newName: String) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const information = {
            'id': id,
            'newName': newName
        };

        return this.http.put('http://localhost:3000/api/tracksNameChange', information, { headers: headers }).map(res => res.json());
    }
}

