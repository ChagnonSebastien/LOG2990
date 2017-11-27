import { LoadingProgressEventService, LoadingProgressEvent } from './events/loading-progress-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { VehicleColor } from './vehicle-color';
import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';

@Injectable()
export class VehicleService {
    public players: Array<Vehicle>;

    private amountVehicleMeshCreated;

    constructor(
        private vehicleMoveEventService: VehicleMoveEventService,
        private vehicleRotateEventService: VehicleRotateEventService,
        private loadingProgressEventService: LoadingProgressEventService
    ) {
        this.amountVehicleMeshCreated = 0;
    }

    public vehicleCreated() {
        if (++this.amountVehicleMeshCreated === 4) {
            this.loadingProgressEventService.sentLoadingEvent(new LoadingProgressEvent('All carts loaded', null));
        }
    }

    public createVehicles(track: Track): void {
        this.players = [];
        for (let color = 1; color <= Object.keys(VehicleColor).length / 2; color++) {
            this.players.push(new Vehicle(color, track,
                this.vehicleMoveEventService, this.vehicleRotateEventService, this.loadingProgressEventService));
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
