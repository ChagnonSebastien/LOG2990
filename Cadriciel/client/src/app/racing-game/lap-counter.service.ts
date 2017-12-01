import { VehicleService } from './vehicle.service';
import { RacingGameService } from './racing-game.service';
import { Injectable } from '@angular/core';
import { TrackUtilities } from './track-utilities';
import { MathUtilities } from './math.utilities';
import { LapEventService, LapEvent } from './events/lap-event.service';


@Injectable()
export class LapCounterService {
    private lastVisitedIntersectionNumber: number;
    private passedCounter: Array<number>;
    private laps: number;

    constructor(private lapEventService: LapEventService, private racingGameService: RacingGameService,
        private vehicleService: VehicleService) {
        this.laps = 0;
        this.lastVisitedIntersectionNumber = 0;
    }

    public initializePassedCounter(): void {
        const numberOfIntersections = this.racingGameService.getTrack().trackIntersections.length;
        this.passedCounter = new Array<number>(numberOfIntersections).fill(0);
    }

    private updatePassedCounter(): void {
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
    }

    private passedFinishLine(): boolean {
        const distanceToIntersectionZero = TrackUtilities.calculateDistanceFromIntersection(
            this.vehicleService.getMainVehicle().getVehicle().position, this.racingGameService.getTrack().trackIntersections[0]);
        const distanceToIntersectionOne = TrackUtilities.calculateDistanceFromIntersection(
            this.vehicleService.getMainVehicle().getVehicle().position, this.racingGameService.getTrack().trackIntersections[1]);
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
