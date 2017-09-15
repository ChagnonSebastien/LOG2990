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

    @HostListener('mousewheel', ['$event'])
    public getMouseDownPoint(event: any) {
        this.trackService.click();
        // this.trackService.getMousePosition(event);
    }


    private onEvent(event: MouseEvent): void {
        this.event = event;
        this.trackService.click();
    }

    private coordinates(event: MouseEvent): void {
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.trackService.pointX = this.clientX;
        this.trackService.pointY = this.clientY;
        // this.trackService.getMousePosition(this.clientX, this.clientY);
    }

    public ngAfterViewInit() {
        this.trackService.initialise(this.container, this.clientX, this.clientY);
    }
}
