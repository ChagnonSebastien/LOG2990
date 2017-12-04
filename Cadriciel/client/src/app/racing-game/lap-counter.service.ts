import { Settings } from './settings';
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
    private lastVisitedIntersectionNumbers: Array<number>;
    private passedCounters: Array<Array<number>>;
    private laps: Array<number>;
    private numberOfVehicles: number;
    private numberOfIntersections: number;

    constructor(
        private lapEventService: LapEventService,
        private racingGameService: RacingGameService,
        private vehicleService: VehicleService
    ) { }

    public initialize(): void {
        this.numberOfVehicles = this.vehicleService.players.length;
        this.numberOfIntersections = this.racingGameService.getTrack().trackIntersections.length;
        this.passedCounters = new Array<Array<number>>(this.numberOfVehicles)
            .fill(new Array<number>(this.numberOfIntersections).fill(0));
        this.laps = new Array<number>(this.numberOfVehicles).fill(0);
        this.lastVisitedIntersectionNumbers = new Array<number>(this.numberOfVehicles).fill(0);
    }

    private updatePassedCounter(): void {
        this.currentZones()
            .forEach((zone, i) => {
                switch (zone) {
                    case Zone.NEXT:
                        this.passedCounters[i][this.nextIntersectionNumbers()[i]]++;
                        this.lastVisitedIntersectionNumbers[i] = this.nextIntersectionNumbers()[i];
                        break;
                    case Zone.PREVIOUS:
                        this.passedCounters[i][this.lastVisitedIntersectionNumbers[i]]--;
                        this.lastVisitedIntersectionNumbers[i] = this.previousIntersectionNumbers()[i];
                }
            });
    }

    private currentZones(): Array<Zone> {
        const distancesToNext = this.distancesToNextIntersection();
        const distancesToLastVisited = this.distanceToLastVisitedIntersections();
        const distancesToPrevious = this.distancesToPreviousIntersections();

        return distancesToLastVisited
            .map((distanceToLastVisited, i) => {
                if (this.closerToNextIntersection(distancesToNext[i], distanceToLastVisited, distancesToPrevious[i])) {
                    return Zone.NEXT;
                } else if (this.closerToPreviousIntersection(distancesToNext[i], distanceToLastVisited, distancesToPrevious[i])) {
                    return Zone.PREVIOUS;
                } else {
                    return Zone.LAST;
                }
            });
    }

    private closerToNextIntersection(
        distanceToNext: number, distanceToLastVisited: number, distanceToPrevious: number
    ): boolean {
        return distanceToNext < distanceToLastVisited && distanceToNext < distanceToPrevious;
    }

    private closerToPreviousIntersection(
        distanceToNext: number, distanceToLastVisited: number, distanceToPrevious: number
    ): boolean {
        return distanceToPrevious < distanceToLastVisited && distanceToPrevious < distanceToNext;
    }

    private currentPositions(): Array<THREE.Vector3> {
        return this.vehicleService.players
            .map(player => player.getMesh().position);
    }

    private intersectionPositions(intersectionNumbers: Array<number>): Array<THREE.Vector2> {
        return intersectionNumbers.map((intersectionNumber) => {
            return this.racingGameService.getTrack().trackIntersections[intersectionNumber];
        });
    }

    private distanceToIntersections(intersectionNumbers: Array<number>): Array<number> {
        const positionsOfIntersections = this.intersectionPositions(intersectionNumbers);
        return this.currentPositions()
            .map((position, index) => {
                return TrackUtilities.calculateDistanceFromIntersection(
                    position,
                    positionsOfIntersections[index]
                );
            });
    }

    private distanceToLastVisitedIntersections(): Array<number> {
        return this.distanceToIntersections(this.lastVisitedIntersectionNumbers);
    }

    private distancesToPreviousIntersections(): Array<number> {
        return this.distanceToIntersections(this.previousIntersectionNumbers());
    }

    private distancesToNextIntersection(): Array<number> {
        return this.distanceToIntersections(this.nextIntersectionNumbers());
    }

    private nextIntersectionNumbers(): Array<number> {
        return this.lastVisitedIntersectionNumbers
            .map((lastVisitedIntersectionNumber) => {
                return (lastVisitedIntersectionNumber + 1) % this.numberOfIntersections;
            });
    }

    private previousIntersectionNumbers(): Array<number> {
        return this.lastVisitedIntersectionNumbers
            .map((lastVisitedIntersectionNumber) => {
                return MathUtilities
                    .negativeSafeModulo(lastVisitedIntersectionNumber - 1, this.numberOfIntersections);
            });
    }

    private passedFinishLine(playerNumber: number): boolean {
        const position = this.vehicleService.players[playerNumber].getMesh().position;
        const distanceToIntersectionZero = TrackUtilities
            .calculateDistanceFromIntersection(position, this.racingGameService.getTrack().trackIntersections[0]);
        const distanceToIntersectionOne = TrackUtilities
            .calculateDistanceFromIntersection(position, this.racingGameService.getTrack().trackIntersections[1]);

        return distanceToIntersectionOne < distanceToIntersectionZero;
    }

    private completedLap(minPassed: number, playerNumber: number): boolean {
        return minPassed > this.laps[playerNumber] && this.passedFinishLine(playerNumber);
    }

    private updateLap(): void {
        this.passedCounters
            .map((passedCounter) => {
                return passedCounter
                    .reduce((prev, next) => {
                        return prev < next ? prev : next;
                    });
            }).map((minPassed, i) => {
                if (this.completedLap(minPassed, i)) {
                    this.laps[i]++;
                    if (i === Settings.HUMAN_COLOR) {
                        this.lapEventService.sendLapEvent(new LapEvent(minPassed));
                    }
                }
            });
    }

    public updateLapCounter(): void {
        this.updatePassedCounter();
        this.updateLap();
    }

}
