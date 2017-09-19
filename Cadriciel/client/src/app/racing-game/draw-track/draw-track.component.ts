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

    private addPoint(event: MouseEvent): void {
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.trackService.pointX = this.clientX;
        this.trackService.pointY = this.clientY;
        this.trackService.push();
    }

    public ngAfterViewInit() {
        this.trackService.initialise(this.container, this.clientX, this.clientY);
    }
}
