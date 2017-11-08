import { Track } from './track';
import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { RenderService } from './render.service';
import { VehicleService } from './vehicle.service';

const numberOfOpponents = 3;
const scale = 25;

@Injectable()
export class RacingGameService {
    private track: Track;

    constructor(private renderService: RenderService, private vehicleService: VehicleService, private countdownService: CountdownService) {
    }

    public async initializeRender(container: HTMLElement, track: Track) {
        this.track = track;
        this.renderService.initialize(container, track, scale);
        await this.addVehicles();
        this.renderService.setCameraOnMainVehicle();
        await this.startCoundown();
        this.renderService.startRenderingLoop();
    }

    private async addVehicles(): Promise<void> {
        await this.vehicleService.initializeMainVehicle(this.track, scale);
        await this.vehicleService.initializeOpponentsVehicles(this.track, scale);
        this.renderService.mainVehicle = this.vehicleService.mainVehicle.vehicle;
        this.renderService.scene.add(this.vehicleService.mainVehicle.vehicle);

        for (let i = 0; i < numberOfOpponents; i++) {
            this.renderService.scene.add(this.vehicleService.opponentsVehicles[i].vehicle);
        }

        return new Promise<void>(resolve => {
            resolve();
        });
    }

    private async startCoundown() {
        await this.countdownService.createCountdown();
        this.renderService.scene.add(this.countdownService.countdownMesh);
    }

}
