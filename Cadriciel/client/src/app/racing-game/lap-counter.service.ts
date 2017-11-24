import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { VehicleService } from './vehicle.service';
import { RenderService } from './render.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const TRACK_RADIUS = 5;
@Injectable()
export class LapCounterService {
    private lastIntersection: THREE.Vector2;
    private lastIntersectionNumber: number;
    private currentIntersectionNumber: number;
    private passedCounter: Array<number>;
    private laps: BehaviorSubject<number>;


    constructor(
        private renderService: RenderService,
        private vehicleService: VehicleService
    ) {
        this.laps = new BehaviorSubject(0);
        this.lastIntersectionNumber = 0;
        this.passedCounter = new Array<number>(this.numberOfIntersections()).fill(0);
        this.renderService.frame.subscribe(() => {
            this.updatePassedCounter();
            this.updateLap();
        });
    }

    public calculateDistanceFromIntersection(carPosition: THREE.Vector3, intersection: THREE.Vector2): number {
        const distanceY = Math.abs(carPosition.y - intersection.y);
        const distanceX = Math.abs(carPosition.x - intersection.x);
        const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

        return distance;
    }

    public isAtIntersection(carPosition: THREE.Vector3, intersection: THREE.Vector2): boolean {
        const distanceFromIntersection = this.calculateDistanceFromIntersection(carPosition, intersection);

        return distanceFromIntersection <= TRACK_RADIUS;
    }

    private getIntersections(): Array<THREE.Vector2> {
        return this.vehicleService.mainVehicle.getTrack().trackIntersections;
    }

    private numberOfIntersections(): number {
        return this.getIntersections().length;
    }

    private updatePassedCounter() {
        const position = this.getVehiclePosition();
        const nextIntersectionNumber = (this.lastIntersectionNumber + 1) % this.numberOfIntersections();
        const previousIntersectionNumber = (this.lastIntersectionNumber - 1) % this.numberOfIntersections();
        const nextIntersection = this.getIntersections()[nextIntersectionNumber];
        const previousIntersection = this.getIntersections()[previousIntersectionNumber];
        if (this.isAtIntersection(position, nextIntersection)) {
            this.passedCounter[nextIntersectionNumber]++;
            this.lastIntersectionNumber = nextIntersectionNumber;
        } else if (this.isAtIntersection(position, previousIntersection)) {
            this.passedCounter[previousIntersectionNumber]--;
            this.lastIntersectionNumber = previousIntersectionNumber;
        }
    }

    private getVehiclePosition(): THREE.Vector3 {
        return this.vehicleService.mainVehicle.getVehicle().position;
    }

    private getFinishLinePosition(): THREE.Vector2 {
        const firstIntersection = this.getIntersections()[0];
        const secondIntersection = this.getIntersections()[1];
        return this.midPoint(firstIntersection, secondIntersection);
    }

    private midPoint(firstPosition: THREE.Vector2, secondPosition: THREE.Vector2): THREE.Vector2 {
        const xMidPoint = this.absoluteAverage(firstPosition.x, secondPosition.x);
        const yMidPoint = this.absoluteAverage(firstPosition.y, secondPosition.y);
        return new THREE.Vector2(xMidPoint, yMidPoint);
    }

    private absoluteAverage(a: number, b: number): number {
        return Math.abs((a - b) / 2);
    }

    private passedFinishLine(): boolean {
        const distanceToIntersectionZero = this.calculateDistanceFromIntersection(this.getVehiclePosition(), this.getIntersections()[0]);
        const distanceToIntersectionOne = this.calculateDistanceFromIntersection(this.getVehiclePosition(), this.getIntersections()[1]);
        return distanceToIntersectionOne < distanceToIntersectionZero;
    }

    private updateLap() {
        const minPassed = this.passedCounter.reduce((prev, next) => {
            return prev < next ? prev : next;
        });
        if (minPassed > this.laps.value && this.passedFinishLine()) {
            this.laps.next(minPassed);
        }
    }

}
