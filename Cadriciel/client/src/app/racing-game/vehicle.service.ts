import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { LoadingProgressEventService, LoadingProgressEvent } from './events/loading-progress-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { RoadLimitService } from './road-limit.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { VehicleColor } from './vehicle-color';
import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CommandsService } from './events/commands.service';
const numberOfOpponents = 3;

@Injectable()
export class VehicleService {
    public players: Array<Vehicle>;

    private amountVehicleMeshCreated;

    constructor(
        private commandsService: CommandsService,
        private vehicleMoveEventService: VehicleMoveEventService,
        // tslint:disable-next-line:no-unused-variable
        private roadLimitService: RoadLimitService,
        // tslint:disable-next-line:no-unused-variable
        private vehicleMovementController: VehicleMovementController,
        // tslint:disable-next-line:no-unused-variable
        private obstacleCollisionDetectionService: ObstacleCollisionDetectionService,
        private obstacleCollisionEventService: ObstacleCollisionEventService,
        private vehicleRotateEventService: VehicleRotateEventService,
        private loadingProgressEventService: LoadingProgressEventService
    ) {
        this.amountVehicleMeshCreated = 0;

        loadingProgressEventService.getLoadingObservable().subscribe((event: LoadingProgressEvent) => {
            if (event.getProgress() === 'Vehicle created') {
                if (++this.amountVehicleMeshCreated === 4) {
                    loadingProgressEventService.sentLoadingEvent(new LoadingProgressEvent('All carts loaded', null));
                }
            }
        });
    }

    public createVehicles(track: Track): void {
        this.players = [];
        for (let color = 1; color <= Object.keys(VehicleColor).length / 2; color++) {
            this.players.push(new Vehicle(color, track, this.obstacleCollisionEventService, this.commandsService,
                this.vehicleMoveEventService, this.vehicleRotateEventService, this.loadingProgressEventService));
        }
    }

    public moveVehicle(): void {
        this.players[0].move();
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
