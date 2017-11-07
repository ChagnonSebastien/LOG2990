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
}
