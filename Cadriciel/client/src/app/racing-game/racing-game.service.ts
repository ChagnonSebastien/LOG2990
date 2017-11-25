import { CameraService } from './camera.service';
import { Track } from './track';
import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { RenderService } from './render.service';
import { VehicleService } from './vehicle.service';
import { RacingSceneService } from './racing-scene.service';

@Injectable()
export class RacingGameService {
    private track: Track;

    constructor(private renderService: RenderService, private vehicleService: VehicleService,
        private countdownService: CountdownService, private cameraService: CameraService, private sceneService: RacingSceneService) {
    }

    public async initializeRender(container: HTMLElement, track: Track): Promise<void> {
        this.track = track;
        this.cameraService.initialize(container);
        this.renderService.initialize(container, track);
        this.addVehicles();
        this.createCoundown();
    }

    private async addVehicles() {
        this.vehicleService.createVehicles(this.track);
    }

    private createCoundown() {
        this.countdownService.createCountdown(this.track);
    }

    public startGame() {
        this.removeCountdown();
    }

    private removeCountdown() {
        this.sceneService.removeObjectByName('countdown');
    }

}
