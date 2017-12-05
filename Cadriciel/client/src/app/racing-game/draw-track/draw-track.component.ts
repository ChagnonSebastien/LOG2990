import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { DrawTrackService } from './draw-track.service';

@Component({
    moduleId: module.id,
    selector: 'app-draw-track-component',
    templateUrl: './draw-track.component.html',
    styleUrls: ['./draw-track.component.css']
})

export class DrawTrackComponent implements AfterViewInit, OnInit {
    public name: string;
    public description: string;
    public difficulty: string;

    public saveEnabled = false;

    constructor(private trackService: DrawTrackService, private route: ActivatedRoute) {
    }

    private get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this.trackService.onResize();
    }

    @HostListener('window:keyup', ['$event'])
    public onKeyUp(): void {
        this.saveEnabled = this.checkForSaveEnabled();
    }

    @HostListener('window:click', ['$event'])
    public onClick(): void {
        this.saveEnabled = this.checkForSaveEnabled();
    }

    private checkForSaveEnabled(): boolean {
        let saveDisabled = false;
        saveDisabled = saveDisabled || this.name === undefined;
        saveDisabled = saveDisabled || this.name === '';
        saveDisabled = saveDisabled || this.description === undefined;
        saveDisabled = saveDisabled || this.description === '';
        saveDisabled = saveDisabled || this.difficulty === undefined;
        saveDisabled = saveDisabled || this.difficulty === '';

        saveDisabled = saveDisabled || !this.trackService.isFinished();
        return !saveDisabled;
    }

    public ngOnInit(): void {
        this.trackService.clear();
        this.name = this.route.snapshot.params['name'];
        if (this.name !== undefined) {
            this.trackService.loadTrack(this.name).then(response => {
                this.description = response.description;
                this.difficulty = response.difficulty;
                this.saveEnabled = true;
            });
        }
    }

    public updateMousePosition(event: MouseEvent): void {
        this.trackService.updateMousePosition(event.clientX, event.clientY);
    }

    public addIntersection(event: MouseEvent): void {
        this.trackService.addIntersection();
        this.saveEnabled = this.checkForSaveEnabled();
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

    public ngAfterViewInit(): void {
        this.trackService.initialise(this.container);
    }

    public addObstacle(type: number): void {
        this.trackService.addObstacle(type);
    }

    public randomizePosition(type: number): void {
        this.trackService.randomizeAllPositions(type);
    }

    public saveTrack(): void {
        if (this.saveEnabled) {
            this.trackService.saveTrack(this.name, this.description, this.difficulty);
        }
    }
}
