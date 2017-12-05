import { VehicleService } from './vehicle.service';
import { RacingGameService } from './racing-game.service';
import { Injectable } from '@angular/core';
import { TrackUtilities } from './track-utilities';
import { MathUtilities } from './math.utilities';
import { LapEventService, LapEvent } from './events/lap-event.service';

enum Zone {
    PREVIOUS, LAST, NEXT
}

const MAIN_PLAYER = 0;

@Injectable()
export class LapCounterService {
    private lastVisitedIntersectionNumbers: Array<number>;
    private passedCounters: Array<Array<number>>;
    private laps: Array<number>;
    private numberOfVehicles: number;
    private numberOfIntersections: number;
    public racePositions: Array<number>;

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
        this.racePositions = new Array<number>(this.numberOfVehicles)
            .map((position, i) => i);
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
        const distancesToNext = this.distancesToNextIntersections();
        const distancesToLastVisited = this.distancesToLastVisitedIntersections();
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

    private distancesToLastVisitedIntersections(): Array<number> {
        return this.distanceToIntersections(this.lastVisitedIntersectionNumbers);
    }

    private distancesToPreviousIntersections(): Array<number> {
        return this.distanceToIntersections(this.previousIntersectionNumbers());
    }

    private distancesToNextIntersections(): Array<number> {
        return this.distanceToIntersections(this.nextIntersectionNumbers());
    }

    private nextIntersectionNumbers(): Array<number> {
        return this.lastVisitedIntersectionNumbers
            .map((lastVisitedIntersectionNumber) => {
                return this.nextIntersectionNumber(lastVisitedIntersectionNumber);
            });
    }

    private nextIntersectionNumber(lastVisitedIntersectionNumber: number): number {
        return (lastVisitedIntersectionNumber + 1) % this.numberOfIntersections;
    }

    private previousIntersectionNumbers(): Array<number> {
        return this.lastVisitedIntersectionNumbers
            .map((lastVisitedIntersectionNumber) => {
                return MathUtilities
                    .negativeSafeModulo(lastVisitedIntersectionNumber - 1, this.numberOfIntersections);
            });
    }

    private previousIntersectionNumber(lastVisitedIntersectionNumber: number): number {
        return MathUtilities.negativeSafeModulo(lastVisitedIntersectionNumber - 1, this.numberOfIntersections);
    }

    private passedFinishLine(playerNumber: number): boolean {
        const position = this.vehicleService.players[playerNumber].getMesh().position;
        const distanceToIntersectionZero = TrackUtilities
            .calculateDistanceFromIntersection(position, this.racingGameService.getTrack().trackIntersections[0]);
        const distanceToIntersectionOne = TrackUtilities
            .calculateDistanceFromIntersection(position, this.racingGameService.getTrack().trackIntersections[1]);

        return distanceToIntersectionOne < distanceToIntersectionZero;
    }

    private updateRacePositions(): void {
        const progressOfPlayers = this.playerProgress();

        progressOfPlayers.sort((a, b) => {
            return a[1] - b[1];
        }).forEach((progress, index) => {
            this.racePositions[progress[0]] = index + 1;
        });
    }

    private playerProgress(): Array<Array<number>> {
        const distancesToLast = this.distancesToLastVisitedIntersections();
        const distancesToPrevious = this.distancesToPreviousIntersections();
        const distancesToNext = this.distancesToNextIntersections();

        return this.passedCounters.map((passedCounter, player) => {
            return [
                player,
                passedCounter.reduce(this.add, 0)
                + this.percentageOfSegmentPassed(
                    player, distancesToLast[player], distancesToNext[player], distancesToPrevious[player]
                )
            ];
        });
    }

    private add(a, b) {
        return a + b;
    }

    private percentageOfSegmentPassed(
        playerNumber: number,
        distanceToLastVisited: number,
        distanceToNext: number,
        distanceToPrevious: number
    ): number {
        const lastIntersectionNumber = this.lastVisitedIntersectionNumbers[playerNumber];
        const lastIntersectionPosition = this.racingGameService.getTrack().trackIntersections[lastIntersectionNumber];

        const nextIntersectionNumber = this.nextIntersectionNumber(lastIntersectionNumber);
        const nextIntersectionPosition = this.racingGameService.getTrack().trackIntersections[nextIntersectionNumber];
        const nextSegmentLength = MathUtilities.distanceBetweenTwoPoints(nextIntersectionPosition, lastIntersectionPosition);

        const previousIntersectionNumber = this.previousIntersectionNumber(lastIntersectionNumber);
        const previousIntersectionPosition = this.racingGameService.getTrack().trackIntersections[previousIntersectionNumber];
        const previousSegmentLength = MathUtilities.distanceBetweenTwoPoints(previousIntersectionPosition, lastIntersectionPosition);

        const angleBetweenPreviousLast = this.angleBetweenAB(distanceToLastVisited, distanceToPrevious, previousSegmentLength);
        const angleBetweenNextLast = this.angleBetweenAB(distanceToLastVisited, distanceToNext, nextSegmentLength);

        if (angleBetweenPreviousLast > angleBetweenNextLast) {
            return -this.normalizedPercentageOfSegment(distanceToLastVisited, distanceToPrevious, previousSegmentLength);
        } else {
            return this.normalizedPercentageOfSegment(distanceToLastVisited, distanceToNext, nextSegmentLength);
        }
    }

    private angleBetweenAB(a: number, b: number, c: number): number {
        // cosine law
        return Math.abs(Math.acos((a * a + b * b - c * c) / (2 * a * b)));
    }

    private normalizedPercentageOfSegment(distanceToLast: number, distanceToOther: number, segmentLength: number): number {
        const theta = this.angleBetweenAB(distanceToLast, segmentLength, distanceToOther);
        const normalizedDistance = distanceToLast * Math.cos(theta);
        return normalizedDistance / segmentLength;
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
                    if (i === MAIN_PLAYER) {
                        this.lapEventService.sendLapEvent(new LapEvent(minPassed));
                    }
                }
            });
    }

    public update(): void {
        this.updatePassedCounter();
        this.updateLap();
        this.updateRacePositions();
    }

}
