import { TrackService } from './game-initialization/track.service';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { RacingGameService } from './racing-game.service';
import { CountdownService } from './countdown.service';

@Component({
    moduleId: module.id,
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RenderService, CameraService, RacingGameService, CountdownService]
})
export class RacingGameComponent implements AfterViewInit, OnInit {

    constructor(
        private renderService: RenderService,
        private route: ActivatedRoute,
        private trackService: TrackService
    ) {
    }

    private get container(): HTMLElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.renderService.onResize();
    }

    public eventsListen(event: any): void {
        this.renderService.eventsList(event);
    }

    public ngOnInit() {
        const trackName = this.route.snapshot.params['name'];
        this.trackService.get(trackName).then(track =>  {
            this.renderService.loadTrack(track);
        });
    }

    public ngAfterViewInit() {
        this.renderService.initialize(this.container, null);
    }

    @HostListener('window:keydown', ['$event'])
    public onStartRace() {
    }
}
