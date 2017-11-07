import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { RenderService } from './render.service';
import { TrackService } from './game-initialization/track.service';

const numberOfOpponents = 3;
@Injectable()
export class RacingGameService {
    private mainVehicle: Vehicle;
    private opponentsVehicles: Array<Vehicle>;

    constructor(private renderService: RenderService, private trackService: TrackService) {
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

    public async initializeRender(container: HTMLElement) {
        this.renderService.initialize(container);
        await this.addVehicles();
        this.renderService.setCameraOnMainVehicle();
        this.renderService.startRenderingLoop();
    }

    public onResize() {
        this.renderService.onResize();
    }

    public eventsList(event: any): void {
        this.renderService.eventsList(event);
    }

    public onInit(trackName: string) {
        this.trackService.get(trackName).then(track => {
            this.renderService.loadTrack(track);
        });
    }
}
