import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Track } from './track'
import 'rxjs/add/operator/map';

@Injectable()
export class TrackService {
    constructor(private http: Http) { }

    getTracks() {
        return this.http.get('http://localhost:3000/api/tracks').map(res => res.json());
    }

    addTracks(newTrack) {

        var headers = new Headers()
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/tracks', newTrack, { headers: headers }).map(res => res.json());
    }

    deleteTrack(id) {
        return this.http.delete('http://localhost:3000/api/tracks' + id).map(res => res.json());
    }

    changeTrackType(id: number, newType: String) {
        var headers = new Headers()
        headers.append('Content-Type', 'application/json');

        let information = {
            "id": id,
            "newType": newType
        }

        return this.http.post('http://localhost:3000/api/tracksTypeChange', information, { headers: headers }).map(res => res.json());
    }



    changeTrackDescription(id: number, newDesc: String) {
        var headers = new Headers()
        headers.append('Content-Type', 'application/json');

        let information = {
            "id": id,
            "newDesc": newDesc
        }

        return this.http.post('http://localhost:3000/api/tracksDescChange', information, { headers: headers }).map(res => res.json());
    }



    changeTrackName(id: number, newName: String) {
        var headers = new Headers()
        headers.append('Content-Type', 'application/json');

        let information = {
            "id": id,
            "newName": newName
        }

        return this.http.put('http://localhost:3000/api/tracksNameChange', information, { headers: headers }).map(res => res.json());
    }
}

