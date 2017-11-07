import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { RacingGameService } from './racing-game.service';

@Component({
    moduleId: module.id,
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RacingGameService]
})
export class RacingGameComponent implements AfterViewInit, OnInit {

    constructor(
        private route: ActivatedRoute,
        private racingGameService: RacingGameService
    ) {
    }

    private get container(): HTMLElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.racingGameService.onResize();
    }

    public eventsListen(event: any): void {
        this.racingGameService.eventsList(event);
    }

    public ngOnInit() {
        this.racingGameService.onInit(this.route.snapshot.params['name']);
    }

    public ngAfterViewInit() {
        this.racingGameService.initializeRender(this.container);
    }

    @HostListener('window:keydown', ['$event'])
    public onStartRace() {
    }
}
