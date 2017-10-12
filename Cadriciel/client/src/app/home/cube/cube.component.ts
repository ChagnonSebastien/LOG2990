import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { RenderService } from '../../racing-game/render.service';

@Component({
    moduleId: module.id,
    selector: 'app-cube-component',
    templateUrl: './cube.component.html',
    styleUrls: ['./cube.component.css']
})

export class CubeComponent implements AfterViewInit {

    constructor(private renderService: RenderService) {
    }

    private get container(): HTMLElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

    @Input()
    public rotationSpeedX = 1;

    @Input()
    public rotationSpeedY = 0;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.renderService.onResize();
    }

    public ngAfterViewInit() {
        this.renderService.initialize(this.container, this.rotationSpeedX, this.rotationSpeedY);
    }
}
