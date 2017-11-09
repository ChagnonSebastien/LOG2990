import { HumanController } from './human-controller';
import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CommandsService } from './commands.service';

const numberOfOpponents = 3;

export enum VehiclesPosition {
    first = 1,
    second = 2,
    third = 3,
    fourth = 4,
}

@Injectable()
export class VehicleService {
    public mainVehicle: Vehicle;
    public opponentsVehicles: Array<Vehicle>;

    constructor(private commandsService: CommandsService) {
        this.mainVehicle = new Vehicle();
        this.opponentsVehicles = [];
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle();
        }
    }

    public initializeMainVehicle(track: Track, scale: number): Promise<Vehicle> {
        return new Promise<Vehicle>(resolve => {
            this.mainVehicle.create3DVehicle(
                track, scale, VehiclesPosition.first, new HumanController(this.commandsService)
            ).then((vehicle) => {
                resolve(vehicle);
            });
        });
    }

    public async initializeOpponentsVehicles(track: Track, scale: number): Promise<Array<Vehicle>> {
        await this.opponentsVehicles[0].create3DVehicle(track, scale, VehiclesPosition.second, new HumanController(this.commandsService));
        await this.opponentsVehicles[1].create3DVehicle(track, scale, VehiclesPosition.third, new HumanController(this.commandsService));
        await this.opponentsVehicles[2].create3DVehicle(track, scale, VehiclesPosition.fourth, new HumanController(this.commandsService));

        return new Promise<Array<Vehicle>>(resolve => {
            resolve(this.opponentsVehicles);
        });
    }

    public engineVehicle() {
        this.mainVehicle.move();
        this.opponentsVehicles.forEach(vehicle => vehicle.move());
    }
}
