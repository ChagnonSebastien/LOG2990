import { Track } from './track';
import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { CommandsService } from './commands.service';
import { Subscription } from 'rxjs/Subscription';
import { Controls } from './controls';

const numberOfOpponents = 3;
enum MOVE_STATE { MOVE_FORWARD, BRAKE }
enum TURN_STATE { TURN_LEFT, TURN_RIGHT, DO_NOTHING }

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
    private subscription: Subscription;
    private event: any;
    private control: Controls;
    private moveState: MOVE_STATE;
    private turnState: TURN_STATE;

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
            this.moveVehicle();
        });
        this.subscription = this.commandsService.getKeyUpEvent()
        .subscribe(event => {
            this.event = event;
            this.stopVehicle();
        });
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

    public moveVehicle() {
        if (this.event.keyCode === 87) {
            this.moveState = MOVE_STATE.MOVE_FORWARD;
        }
        if (this.event.keyCode === 65) {
            this.turnState = TURN_STATE.TURN_LEFT;
        }
        if (this.event.keyCode === 68) {
            this.turnState = TURN_STATE.TURN_RIGHT;
        }
    }

    public stopVehicle() {
        if (this.event.keyCode === 87) {
            this.moveState = MOVE_STATE.BRAKE;
        }

        if (this.event.keyCode === 65 || this.event.keyCode === 68 ) {
            this.turnState = TURN_STATE.DO_NOTHING;
        }
    }

    public engineVehicle() {
        if (this.moveState === MOVE_STATE.MOVE_FORWARD) {
            this.control.accelerate(this.mainVehicle.vehicle);
        }

        if (this.moveState === MOVE_STATE.BRAKE) {
            this.control.brake(this.mainVehicle.vehicle);
        }

        if (this.turnState === TURN_STATE.TURN_RIGHT) {
            this.control.rightRotation(this.mainVehicle.vehicle);
        }

        if (this.turnState === TURN_STATE.TURN_LEFT) {
            this.control.leftRotation(this.mainVehicle.vehicle);
        }

        if (this.turnState === TURN_STATE.DO_NOTHING) {
            // nothing
        }
    }
}
