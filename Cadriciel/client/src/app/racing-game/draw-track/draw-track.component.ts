import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { DrawTrackService } from './draw-track.service';
import { ObstacleService } from './obstacle.service';
import { ObstacleType } from './obstacle';

@Component({
    moduleId: module.id,
    selector: 'app-draw-track-component',
    templateUrl: './draw-track.component.html',
    styleUrls: ['./draw-track.component.css']
})

export class DrawTrackComponent implements AfterViewInit {

    public saveEnabled = false;

    constructor(private trackService: DrawTrackService, private obstacleService: ObstacleService) {
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

    public updateMousePosition(event: MouseEvent): void {
        this.trackService.updateMousePosition(event.clientX, event.clientY);
    }

    public addIntersection(event: MouseEvent): void {
        this.trackService.addIntersection();
        this.saveEnabled = this.trackService.isFinished();
    }

    public removeIntersection(event: MouseEvent): void {
        this.trackService.removeIntersection();
        this.saveEnabled = false;
    }

    public startDrag(event: MouseEvent): void {
        this.trackService.startDrag();
    }

    public endDrag(event: MouseEvent): void {
        this.trackService.endDrag();
    }

    public ngAfterViewInit() {
        this.trackService.initialise(this.container);
    }

    public addObstacle(type: number) {
        this.trackService.addObstacle(type);
    }

    public randomizePosition(type: number) {
        this.trackService.randomizeAllPositions(type);
    }
}
