import { ControllerFactory } from './controller-factory.service';
import { LoadingProgressEventService, LoadingProgressEvent } from './events/loading-progress-event.service';
import { VehicleColor } from './vehicle-color';
import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { Controller } from './controller';

@Injectable()
export class VehicleService {
    public players: Array<Vehicle>;

    private amountVehicleMeshCreated;

    constructor(
        private loadingProgressEventService: LoadingProgressEventService,
        private controllerFactory: ControllerFactory
    ) {
        this.amountVehicleMeshCreated = 0;
    }

    public vehicleCreated(): void {
        if (++this.amountVehicleMeshCreated === Object.keys(VehicleColor).length / 2) {
            this.loadingProgressEventService.sentLoadingEvent(new LoadingProgressEvent('All carts loaded', null));
        }
    }

    public createVehicles(track: Track): void {
        this.players = [];
        for (let color = 1; color <= Object.keys(VehicleColor).length / 2; color++) {
            this.players.push(new Vehicle(color, track, this.createController(track, color), this.loadingProgressEventService));
        }
    }

    private createController(track: Track, color: VehicleColor): Controller {
        if (color === VehicleColor.red) {
            return this.controllerFactory.newHumanController();
        } else if (track.type === '') {
            return this.controllerFactory.newHumanController();
        } else {
            return this.controllerFactory.newHumanController();
        }
    }

    public getVehicle(color: VehicleColor): Vehicle {
        return this.players.filter((vehicle: Vehicle) => vehicle.getColor() === color)[0];
    }

    public getMainVehicle(): Vehicle {
        return this.getVehicle(VehicleColor.red);
    }

    public getVehicles(): Vehicle[] {
        return this.players;
    }
}
