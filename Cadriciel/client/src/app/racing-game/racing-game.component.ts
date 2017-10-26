import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';

@Component({
    moduleId: module.id,
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    providers: [RenderService, CameraService]
})
export class RacingGameComponent implements AfterViewInit {

    constructor(private renderService: RenderService) {
    }

    private get container(): HTMLElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

    @Input()
    public rotationSpeedX = 0.005;

    @Input()
    public rotationSpeedY = 0.005;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.renderService.onResize();
    }

    public eventsListen(event: any): void {
        this.renderService.eventsList(event);
    }

    public ngAfterViewInit() {
        this.renderService.initialize(this.container, this.rotationSpeedX, this.rotationSpeedY);
    }
}
