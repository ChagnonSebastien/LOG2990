import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VehicleService } from './vehicle.service';
import { RenderService } from './render.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { TrackUtilities } from './track-utilities';

const TRACK_RADIUS = 5;
@Injectable()
export class LapCounterService {
    private lastIntersectionNumber: number;
    private passedCounter: Array<number>;
    private laps: BehaviorSubject<number>;

    constructor(
        private renderService: RenderService,
        private vehicleService: VehicleService
    ) {
        this.laps = new BehaviorSubject(0);
        this.lastIntersectionNumber = 0;
        this.passedCounter = new Array<number>(TrackUtilities.numberOfIntersections()).fill(0);
        this.subscribeToRenderFrame();
    }

    private subscribeToRenderFrame(): void {
        this.renderService.frame.subscribe(() => {
            this.updatePassedCounter();
            this.updateLap();
        });
    }

    private updatePassedCounter(): void {
        const position = TrackUtilities.getVehiclePosition();
        const nextIntersectionNumber = (this.lastIntersectionNumber + 1) % TrackUtilities.numberOfIntersections();
        const previousIntersectionNumber = (this.lastIntersectionNumber - 1) % TrackUtilities.numberOfIntersections();
        const nextIntersection = TrackUtilities.getIntersections()[nextIntersectionNumber];
        const previousIntersection = TrackUtilities.getIntersections()[previousIntersectionNumber];
        if (TrackUtilities.isAtIntersection(position, nextIntersection)) {
            this.passedCounter[nextIntersectionNumber]++;
            this.lastIntersectionNumber = nextIntersectionNumber;
        } else if (TrackUtilities.isAtIntersection(position, previousIntersection)) {
            this.passedCounter[previousIntersectionNumber]--;
            this.lastIntersectionNumber = previousIntersectionNumber;
        }
    }

    private passedFinishLine(): boolean {
        const distanceToIntersectionZero = TrackUtilities.calculateDistanceFromIntersection(
            TrackUtilities.getVehiclePosition(), TrackUtilities.getIntersections()[0]);
        const distanceToIntersectionOne = TrackUtilities.calculateDistanceFromIntersection(
            TrackUtilities.getVehiclePosition(), TrackUtilities.getIntersections()[1]);
        return distanceToIntersectionOne < distanceToIntersectionZero;
    }

    private updateLap(): void {
        const minPassed = this.passedCounter.reduce((prev, next) => {
            return prev < next ? prev : next;
        });
        if (minPassed > this.laps.value && this.passedFinishLine()) {
            this.laps.next(minPassed);
        }
    }

}
