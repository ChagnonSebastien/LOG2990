import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { RenderService } from './render.service';

const numberOfOpponents = 3;
@Injectable()
export class RacingGameService {
    private mainVehicle: Vehicle;
    private opponentsVehicles: Array<Vehicle>;

    constructor(private renderService: RenderService) {
        this.mainVehicle = new Vehicle();
        this.opponentsVehicles = [];
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle();
        }
    }

    private initializeMainVehicle(): Promise<Vehicle> {
        return new Promise<Vehicle>(resolve => {
            this.mainVehicle.create3DVehicle(-150, 30, 0).then((vehicle) => {
                resolve(vehicle);
            });
        });
    }

    private async initializeOpponentsVehicles(): Promise<Array<Vehicle>> {
        await this.opponentsVehicles[0].create3DVehicle(-150, 30, 200);
        await this.opponentsVehicles[1].create3DVehicle(150, 30, 0);
        await this.opponentsVehicles[2].create3DVehicle(150, 30, 200);

        return new Promise<Array<Vehicle>>(resolve => {
            resolve(this.opponentsVehicles);
        });
    }

    public async initializeRender(container: HTMLElement) {
        this.renderService.initialize(container);
        await this.addVehicles();
        this.renderService.setCameraOnMainVehicle();
        this.renderService.startRenderingLoop();
    }

    private async addVehicles(): Promise<void> {
        await this.initializeMainVehicle();
        await this.initializeOpponentsVehicles();
        this.renderService.mainVehicle = this.mainVehicle.vehicle;
        this.renderService.scene.add(this.mainVehicle.vehicle);

        for (let i = 0; i < numberOfOpponents; i++) {
            this.renderService.scene.add(this.opponentsVehicles[i].vehicle);
        }

        return new Promise<void>(resolve => {
            resolve();
        });
    }

}
