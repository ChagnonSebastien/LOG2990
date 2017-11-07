import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';

const numberOfOpponents = 3;

@Injectable()
export class VehicleService {
    private mainVehicle: Vehicle;
    private opponentsVehicles: Array<Vehicle>;

    constructor() {
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
}
