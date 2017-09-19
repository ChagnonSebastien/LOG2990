import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { DrawTrackService } from './draw-track.service';

@Component({
    moduleId: module.id,
    selector: 'app-draw-track-component',
    templateUrl: './draw-track.component.html',
    styleUrls: ['./draw-track.component.css']
})

export class DrawTrackComponent implements AfterViewInit {
    constructor(private trackService: DrawTrackService) {
    }

    private get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    private event: MouseEvent;
    private clientX = 0;
    private clientY = 0;

    @ViewChild('container')
    private containerRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    public onResize() {
       this.trackService.onResize();
    }

    public addPoint(event: MouseEvent): void {
        this.trackService.addPoint();
    }

    public updateMousePosition(event: MouseEvent): void {
        this.clientX = event.clientX; //For debug purposes
        this.clientY = event.clientY; //For debug purposes
        this.trackService.updateMousePosition(event.clientX, event.clientY);
    }

    public ngAfterViewInit() {
        this.trackService.initialise(this.container, this.clientX, this.clientY);
    }
}
