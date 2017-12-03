import { VehicleService } from './vehicle.service';
import { RacingGameService } from './racing-game.service';
import { Injectable } from '@angular/core';
import { TrackUtilities } from './track-utilities';
import { MathUtilities } from './math.utilities';
import { LapEventService, LapEvent } from './events/lap-event.service';

enum Zone {
    PREVIOUS, LAST, NEXT
}

@Injectable()
export class LapCounterService {
    private lastVisitedIntersectionNumber: number;
    private passedCounter: Array<number>;
    private laps: number;

    constructor(
        private lapEventService: LapEventService,
        private racingGameService: RacingGameService,
        private vehicleService: VehicleService
    ) {
        this.laps = 0;
        this.lastVisitedIntersectionNumber = 0;
    }

    public initializePassedCounter(): void {
        const numberOfIntersections = this.racingGameService.getTrack().trackIntersections.length;
        this.passedCounter = new Array<number>(numberOfIntersections).fill(0);
    }

    /*private updatePassedCounter(): void {
        const numberOfIntersections = this.racingGameService.getTrack().trackIntersections.length;
        const position = this.vehicleService.getMainVehicle().getVehicle().position;
        const nextIntersectionNumber = (this.lastVisitedIntersectionNumber + 1) % numberOfIntersections;
        const previousIntersectionNumber = MathUtilities
            .negativeSafeModulo((this.lastVisitedIntersectionNumber - 1), numberOfIntersections);
        const nextIntersection = this.racingGameService.getTrack().trackIntersections[nextIntersectionNumber];
        const previousIntersection = this.racingGameService.getTrack().trackIntersections[previousIntersectionNumber];
        if (TrackUtilities.isAtIntersection(position, nextIntersection)) {
            this.passedCounter[nextIntersectionNumber]++;
            this.lastVisitedIntersectionNumber = nextIntersectionNumber;
        } else if (TrackUtilities.isAtIntersection(position, previousIntersection)) {
            this.passedCounter[previousIntersectionNumber]--;
            this.lastVisitedIntersectionNumber = previousIntersectionNumber;
        }
    }*/

    private updatePassedCounter(): void {
        const numberOfIntersections = this.racingGameService.getTrack().trackIntersections.length;
        switch (this.currentZone()) {
            case Zone.NEXT:
                this.passedCounter[this.nextIntersectionNumber()]++;
                this.lastVisitedIntersectionNumber = this.nextIntersectionNumber();
                break;
            case Zone.PREVIOUS:
                this.passedCounter[this.lastVisitedIntersectionNumber]--;
                this.lastVisitedIntersectionNumber = this.previousIntersectionNumber();
        }
    }

    private currentZone(): Zone {
        const distanceToNext = this.distanceToNextIntersection();
        const distanceToLastVisited = this.distanceToLastVisitedIntersection();
        const distanceToPrevious = this.distanceToPreviousIntersection();

        if (distanceToNext < distanceToLastVisited && distanceToNext < distanceToPrevious) {
            return Zone.NEXT;
        } else if (distanceToPrevious < distanceToLastVisited && distanceToPrevious < distanceToNext) {
            return Zone.PREVIOUS;
        } else {
            return Zone.LAST;
        }
    }

    private distanceToLastVisitedIntersection(): number {
        const currentPosition = this.vehicleService.getMainVehicle().getMesh().position;
        const lastIntersectionPosition = this.racingGameService
            .getTrack().trackIntersections[this.lastVisitedIntersectionNumber];
        return TrackUtilities
            .calculateDistanceFromIntersection(
            currentPosition,
            lastIntersectionPosition
            );
    }

    private distanceToPreviousIntersection(): number {
        const currentPosition = this.vehicleService.getMainVehicle().getMesh().position;
        const previousIntersectionPosition = this.racingGameService
            .getTrack().trackIntersections[this.previousIntersectionNumber()];
        return TrackUtilities
            .calculateDistanceFromIntersection(
            currentPosition,
            previousIntersectionPosition
            );
    }

    private distanceToNextIntersection(): number {
        const currentPosition = this.vehicleService.getMainVehicle().getMesh().position;
        const nextIntersectionPosition = this.racingGameService
            .getTrack().trackIntersections[this.nextIntersectionNumber()];
        return TrackUtilities
            .calculateDistanceFromIntersection(
            currentPosition,
            nextIntersectionPosition
            );
    }

    private nextIntersectionNumber(): number {
        const numberOfIntersections = this.racingGameService.getTrack().trackIntersections.length;
        return (this.lastVisitedIntersectionNumber + 1) % numberOfIntersections;
    }

    private previousIntersectionNumber(): number {
        const numberOfIntersections = this.racingGameService.getTrack().trackIntersections.length;
        return MathUtilities.negativeSafeModulo(this.lastVisitedIntersectionNumber - 1, numberOfIntersections);
    }

    private passedFinishLine(): boolean {
        const distanceToIntersectionZero = TrackUtilities.calculateDistanceFromIntersection(
            this.vehicleService.getMainVehicle().getMesh().position, this.racingGameService.getTrack().trackIntersections[0]);
        const distanceToIntersectionOne = TrackUtilities.calculateDistanceFromIntersection(
            this.vehicleService.getMainVehicle().getMesh().position, this.racingGameService.getTrack().trackIntersections[1]);
        return distanceToIntersectionOne < distanceToIntersectionZero;
    }

    private updateLap(): void {
        const minPassed = this.passedCounter.reduce((prev, next) => {
            return prev < next ? prev : next;
        });
        if (minPassed > this.laps && this.passedFinishLine()) {
            this.laps++;
            this.lapEventService.sendLapEvent(new LapEvent(minPassed));
        }
    }

    public updateLapCounter(): void {
        this.updatePassedCounter();
        this.updateLap();
    }

}
