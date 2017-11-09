import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';

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

    constructor() {
        this.mainVehicle = new Vehicle();
        this.opponentsVehicles = [];
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle();
        }
    }

    public initializeMainVehicle(track: Track, scale: number): Promise<Vehicle> {
        return new Promise<Vehicle>(resolve => {
            this.mainVehicle.create3DVehicle(track, scale, VehiclesPosition.first).then((vehicle) => {
                resolve(vehicle);
            });
        });
    }

    public async initializeOpponentsVehicles(track: Track, scale: number): Promise<Array<Vehicle>> {
        await this.opponentsVehicles[0].create3DVehicle(track, scale, VehiclesPosition.second);
        await this.opponentsVehicles[1].create3DVehicle(track, scale, VehiclesPosition.third);
        await this.opponentsVehicles[2].create3DVehicle(track, scale, VehiclesPosition.fourth);

        return new Promise<Array<Vehicle>>(resolve => {
            resolve(this.opponentsVehicles);
        });
    }
}
