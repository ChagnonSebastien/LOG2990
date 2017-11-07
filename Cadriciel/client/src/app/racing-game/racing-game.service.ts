import { CountdownService } from './countdown.service';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { RenderService } from './render.service';
import { VehicleService } from './vehicle.service';

const numberOfOpponents = 3;
@Injectable()
export class RacingGameService {
    private mainVehicle: Vehicle;
    private opponentsVehicles: Array<Vehicle>;

    constructor(private renderService: RenderService, private vehicleService: VehicleService, private countdownService: CountdownService) {
        this.mainVehicle = new Vehicle();
        this.opponentsVehicles = [];
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle();
        }
    }

    public async initializeRender(container: HTMLElement) {
        this.renderService.initialize(container);
        await this.addVehicles();
        this.renderService.setCameraOnMainVehicle();
        await this.startCoundown();
        this.renderService.startRenderingLoop();
    }

    private async addVehicles(): Promise<void> {
        await this.vehicleService.initializeMainVehicle();
        await this.vehicleService.initializeOpponentsVehicles();
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
