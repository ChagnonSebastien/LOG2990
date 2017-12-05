import { TrackService } from './../racing-game/game-initialization/track.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin-tracks-component',
    templateUrl: './admin-tracks.component.html',
    styles: ['#add-track { margin-top:40px; }']
})
export class AdminTracksComponent implements OnInit {

    public trackName: string;
    public trackJustDeleted = false;

    constructor(private route: ActivatedRoute, private trackService: TrackService) { }

    public getRoute(): ActivatedRoute {
        return this.route;
    }

    public ngOnInit(): void {
    }

    public onActivate(event): void {
        setTimeout(() => { // To respect the unidirectional data flow rule
            this.trackName = event.getRoute().snapshot.params['name'];
            event.getRoute().params.subscribe(params => this.trackName = params.name);
        }, 0);
    }

    public onDeactivate(event): void {
        if (!this.trackJustDeleted) {
            this.trackName = undefined;
        }
    }

    public async delete(): Promise<boolean> {
        this.trackJustDeleted = true;
        let response = false;
        await this.trackService.delete(this.trackName).then(res => {
            response = (res !== 'connectionError');
            this.trackName = undefined;
            this.trackJustDeleted = false;
        });
        return response;
    }
}
