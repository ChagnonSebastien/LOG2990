import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CommandsService } from './commands.service';
import { Subscription } from 'rxjs/Subscription';
import { Controls } from './controls';

const numberOfOpponents = 3;


@Injectable()
export class VehicleService {
    public mainVehicle: Vehicle;
    public opponentsVehicles: Array<Vehicle>;
    private subscription: Subscription;
    private event: any;
    private keyIsDown: boolean;
    private control: Controls;

    constructor(private commandsService: CommandsService) {
        this.mainVehicle = new Vehicle();
        this.control = new Controls(0, 0.02, Math.PI / 50);
        this.opponentsVehicles = [];
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle();
        }
        this.subscription = this.commandsService.getKeyDownEvent()
        .subscribe(event => {
            this.event = event;
        });
    }

    public initializeMainVehicle(): Promise<Vehicle> {
        return new Promise<Vehicle>(resolve => {
            this.mainVehicle.create3DVehicle(-150, 30, 0).then((vehicle) => {
                resolve(vehicle);
            });
        });
    }

    public async initializeOpponentsVehicles(): Promise<Array<Vehicle>> {
        await this.opponentsVehicles[0].create3DVehicle(-150, 30, 200);
        await this.opponentsVehicles[1].create3DVehicle(150, 30, 0);
        await this.opponentsVehicles[2].create3DVehicle(150, 30, 200);

        return new Promise<Array<Vehicle>>(resolve => {
            resolve(this.opponentsVehicles);
        });
    }
}
