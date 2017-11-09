import { CountdownService } from './countdown.service';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { RacingGameService } from './racing-game.service';
import { RenderService } from './render.service';
import { TrackService } from './game-initialization/track.service';
import { CommandsService } from './commands.service';

@Component({
    moduleId: module.id,
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: []
})
export class RacingGameComponent implements AfterViewInit, OnInit {

    constructor(
        private route: ActivatedRoute,
        private racingGameService: RacingGameService,
        private renderService: RenderService,
        private trackService: TrackService,
        private countdownService: CountdownService,
        private commandsService: CommandsService
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

    public eventsDownListen(event: any): void {
        this.commandsService.sendKeyDownEvent(event);
    }

    public eventsUpListen(event: any): void {
        this.commandsService.sentKeyUpEvent(event);
    }

    public ngOnInit() {
        const trackName = this.route.snapshot.params['name'];
        this.trackService.get(trackName).then(track => {
            this.renderService.loadTrack(track);
        });
    }

    public ngAfterViewInit() {
        this.racingGameService.initializeRender(this.container);
    }

    private startCountdown(event: any) {
        if (event.keyCode === 32 && this.countdownService.countdownStarted === false) {
            this.countdownService.countdownStarted = true;
            this.countdownService.startCountdown();
        }
    }

    @HostListener('window:keydown', ['$event'])
    public onStartRace() {
        this.startCountdown(event);
    }

}
