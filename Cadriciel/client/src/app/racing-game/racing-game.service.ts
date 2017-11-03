import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

const numberOfOpponents = 3;
@Injectable()
export class RacingGameService {
    public mainVehicle: Vehicle;
    public opponentsVehicles: Array<Vehicle>;
    private vehicleSubject: Subject<any>;
    private opponentsSubject: Subject<any>;
    public numberOfVehiclesInitialized: number;

    constructor() {
        this.vehicleSubject = new Subject();
        this.mainVehicle = new Vehicle();
        this.opponentsVehicles = [];
        this.numberOfVehiclesInitialized = 0;
        for (let i = 0; i < numberOfOpponents; i++) {
            this.opponentsVehicles[i] = new Vehicle();
        }
        this.alertWhenVehicleIsInitialized();
        this.initializeVehicle();
        this.initializeOpponentsVehicles();
    }

    public async initializeVehicle() {

        this.mainVehicle.createVehicle(300, 30, 0);
    }

    private initializeOpponentsVehicles() {
        console.log('opnnents initializing');
        this.opponentsVehicles[0].createVehicle(200, 30, 0);
    }

    public vehicleAlerts(): Observable<any> {
        return this.vehicleSubject.asObservable();
    }

    public opponentsAlerts(): Observable<any> {
        console.log('second vehicle init');
        return this.opponentsSubject.asObservable();
    }

    private alertVehicle() {
        this.vehicleSubject.next(this.mainVehicle.vehicle);
    }

    private alertOpponentsVehicles() {
        console.log('ALERT OPPONENTS VEHICLES');
        this.opponentsSubject.next(this.opponentsVehicles);
    }

    private alertWhenVehicleIsInitialized() {
        this.mainVehicle.vehicleAlert().subscribe((result) => {
            this.numberOfVehiclesInitialized++;
            if (this.numberOfVehiclesInitialized === 1) {
                this.alertVehicle();
            } else if (this.numberOfVehiclesInitialized === 2) {
                this.alertOpponentsVehicles();
            }
        });
    }

    private alertWhenOpponentsAreInitialized() {

    }



}
