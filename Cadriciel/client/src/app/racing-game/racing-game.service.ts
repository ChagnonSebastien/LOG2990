import { CountdownDecreaseEvent } from './events/countdown-decrease-event';
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
        private countdownService: CountdownService, private cameraService: CameraService) {
        this.listenForEndOfCountdown();
    }

    public async initializeRender(container: HTMLElement, track: Track): Promise<void> {
        this.track = track;
        this.renderService.initialize(container, track);
        await this.addVehicles();
        this.cameraService.initializeCameras(
            this.renderService.container, this.vehicleService.mainVehicle.getVehicle());
        await this.createCoundown();
        this.renderService.startRenderingLoop();
    }

    private async addVehicles(): Promise<void> {
        await this.vehicleService.initializeMainVehicle(this.track);
        await this.vehicleService.initializeOpponentsVehicles(this.track);
        this.renderService.scene.add(this.vehicleService.mainVehicle.getVehicle());
      //  this.renderService.scene.add(this.collisionDetectionService.getBox(this.vehicleService.mainVehicle.getVehicle()));

        for (let i = 0; i < numberOfOpponents; i++) {
            this.renderService.scene.add(this.vehicleService.opponentsVehicles[i].getVehicle());
          //  this.renderService.scene.add(this.collisionDetectionService.getBox(this.vehicleService.mainVehicle.getVehicle()));
        }

        return new Promise<void>(resolve => {
            resolve();
        });
    }

    private async createCoundown() {
        await this.countdownService.createCountdown(this.track);
        this.renderService.scene.add(this.countdownService.countdownMesh);
    }

    private listenForEndOfCountdown() {
        this.countdownService.getCountdownDecreaseEvents().subscribe((countDownDecreaseEvent: CountdownDecreaseEvent) => {
            if (countDownDecreaseEvent.getNewAmount() === 0) {
                this.removeCountdown();
            }
        });
    }

    private removeCountdown() {
        const selectedObject = this.renderService.scene.getObjectByName(this.countdownService.countdownMesh.name);
        this.renderService.scene.remove(selectedObject);
    }

}
