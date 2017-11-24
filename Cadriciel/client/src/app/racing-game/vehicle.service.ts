import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { LoadingProgressEventService, LoadingProgressEvent } from './events/loading-progress-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { RoadLimitService } from './road-limit.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { VehicleColor } from './vehicle-color';
import { HumanController } from './human-controller';
import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CommandsService } from './events/commands.service';
const numberOfOpponents = 3;

@Injectable()
export class VehicleService {
    public players: Array<Vehicle>;

    private nbr = 0;

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
        loadingProgressEventService.getLoadingObservable().subscribe((event: LoadingProgressEvent) => {
            if (event.getProgress() === 'Vehicle created') {
                if (++this.nbr === 4) {
                    loadingProgressEventService.sentLoadingEvent(new LoadingProgressEvent('All carts loaded', null));
                }
            }
        });
    }

    public getMainVehicle() {
        return this.players[0];
    }

    public createVehicles(track: Track) {
        this.players = [];
        for (let color = 1; color <= numberOfOpponents + 1; color++) {
            console.log(VehicleColor[color]);
            this.players.push(new Vehicle(color, track, this.obstacleCollisionEventService, this.commandsService,
                this.vehicleMoveEventService, this.vehicleRotateEventService, this.loadingProgressEventService));
        }
    }

    public moveVehicle() {
        this.players[0].move();
    }

    public getVehicles() {
        return this.players;
    }
}
