import { RaceMediator } from './mediator.service';
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
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
        private renderService: RenderService,
        private trackService: TrackService,
        private commandsService: CommandsService,
        private raceMediator: RaceMediator
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

    public ngAfterViewInit(): void {
        const trackName = this.route.snapshot.params['name'];
        this.trackService.get(trackName).then(track => {
            this.raceMediator.startProgram(this.container, track);
        });
    }
}
