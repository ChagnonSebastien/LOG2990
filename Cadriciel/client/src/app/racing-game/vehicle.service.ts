import { RoadLimitService } from './road-limit.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { RaceService } from './race.service';
import { CountdownService } from './countdown.service';
import { ObstacleService } from './obstacle.service';
import { VehicleColor } from './vehicle-color';
import { HumanController } from './human-controller';
import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CommandsService } from './events/commands.service';
import { CollisionDetectionService } from './collision-detection.service';
const numberOfOpponents = 3;

@Injectable()
export class VehicleService {
    public mainVehicle: Vehicle;
    public opponentsVehicles: Array<Vehicle>;

    constructor(
        private commandsService: CommandsService,
        private obstacleService: ObstacleService,
        private countdownService: CountdownService,
        private raceService: RaceService,
        private collisionDetectionService: CollisionDetectionService,
        private vehicleMoveEventService: VehicleMoveEventService,
        // tslint:disable-next-line:no-unused-variable
        private roadLimitService: RoadLimitService
    ) {
        this.mainVehicle = new Vehicle(this.obstacleService, this.collisionDetectionService);
        this.opponentsVehicles = [];
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle(this.obstacleService, this.collisionDetectionService);
        }
    }

    public initializeMainVehicle(track: Track, scale: number): Promise<Vehicle> {
        return new Promise<Vehicle>(resolve => {
            this.mainVehicle.create3DVehicle(
                track, scale, VehicleColor.red, new HumanController(this.commandsService, this.countdownService,
                    this.raceService, this.collisionDetectionService, this.vehicleMoveEventService)
            ).then((vehicle) => {
                resolve(vehicle);
            });
        });
    }

    public async initializeOpponentsVehicles(track: Track, scale: number): Promise<Array<Vehicle>> {
        await this.opponentsVehicles[0].create3DVehicle(track, scale, VehicleColor.blue,
            new HumanController(
                this.commandsService,
                this.countdownService,
                this.raceService,
                this.collisionDetectionService,
                this.vehicleMoveEventService
            ));
        await this.opponentsVehicles[1].create3DVehicle(track, scale, VehicleColor.green,
            new HumanController(
                this.commandsService, this.countdownService, this.raceService,
                this.collisionDetectionService, this.vehicleMoveEventService));
        await this.opponentsVehicles[2].create3DVehicle(track, scale, VehicleColor.yellow,
            new HumanController(
                this.commandsService, this.countdownService, this.raceService,
                this.collisionDetectionService, this.vehicleMoveEventService));

        return new Promise<Array<Vehicle>>(resolve => {
            resolve(this.opponentsVehicles);
        });
    }

    public moveVehicle() {
        this.mainVehicle.move();
    }
}
