import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { DrawTrackService } from './draw-track.service';

@Component({
    moduleId: module.id,
    selector: 'app-draw-track-component',
    templateUrl: './draw-track.component.html',
    styleUrls: ['./draw-track.component.css']
})

export class DrawTrackComponent implements AfterViewInit {

    private saveEnabled = false;

    constructor(private trackService: DrawTrackService) {
    }

    private get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.trackService.onResize();
    }

    public addIntersection(event: MouseEvent): void {
        this.trackService.addIntersection();
        this.saveEnabled = this.trackService.isFinished();
    }

    public removeIntersection(event: MouseEvent): void {
        this.trackService.removeIntersection();
        this.saveEnabled = false;
    }

    public updateMousePosition(event: MouseEvent): void {
        this.trackService.updateMousePosition(event.clientX, event.clientY);
    }

    public ngAfterViewInit() {
        this.trackService.initialise(this.container);
    }
}
