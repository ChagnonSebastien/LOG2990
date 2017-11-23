import { ObstacleService } from './obstacle.service';
import { CountdownService } from './countdown.service';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RacingGameService } from './racing-game.service';
import { RenderService } from './render.service';
import { TrackService } from './game-initialization/track.service';
import { CommandsService } from './events/commands.service';

@Component({
    moduleId: module.id,
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: []
})
export class RacingGameComponent implements AfterViewInit {

    constructor(
        private route: ActivatedRoute,
        private racingGameService: RacingGameService,
        private renderService: RenderService,
        private trackService: TrackService,
        private countdownService: CountdownService,
        private commandsService: CommandsService,
        private obstacleService: ObstacleService
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
        this.commandsService.keyDown(event);
    }

    public eventsUpListen(event: any): void {
        this.commandsService.keyUp(event);
    }

    public ngAfterViewInit() {
        const trackName = this.route.snapshot.params['name'];
        this.trackService.get(trackName).then(track => {
            this.racingGameService.initializeRender(this.container, track);
            this.obstacleService.initialize(track);
        });
    }
}
