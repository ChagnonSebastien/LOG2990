import { SceneService } from './scene.service';
import { CameraService } from './camera.service';
import { Track } from './track';
import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { RenderService } from './render.service';
import { VehicleService } from './vehicle.service';

const numberOfOpponents = 3;

@Injectable()
export class RacingGameService {
    private track: Track;

    constructor(private renderService: RenderService, private vehicleService: VehicleService,
        private countdownService: CountdownService, private cameraService: CameraService, private sceneService: SceneService) {
    }

    public async initializeRender(container: HTMLElement, track: Track): Promise<void> {
        this.track = track;
        this.cameraService.initialize(container);
        this.renderService.initialize(container, track);
        this.addVehicles();
        await this.createCoundown();
    }

    private async addVehicles() {
        this.vehicleService.createVehicles(this.track);
    }

    private async createCoundown() {
        await this.countdownService.createCountdown(this.track);
        this.sceneService.addToScene(this.countdownService.countdownMesh);
    }

    public startGame() {
        this.removeCountdown();
    }

    private removeCountdown() {
        const selectedObject = this.sceneService.scene.getObjectByName(this.countdownService.countdownMesh.name);
        this.sceneService.removeFromScene(selectedObject);
    }

}
