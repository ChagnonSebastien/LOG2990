import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface Observer {
    update(): void;
}

@Injectable()
export class TrackValidationService {
    public trackElements: {
        intersection: THREE.Vector3,
        intersectionAngle: boolean,
        segmentLengthValid: boolean,
        segmentIntersections: number[]
    }[] = [];

    public trackClosed = false;

    public observer: Observer;

    public addPoint(intersection: THREE.Vector3) {
        this.trackElements.push(
            { intersection, intersectionAngle: false, segmentLengthValid: false, segmentIntersections: [] }
        );
        this.checkSegmentLength(this.trackElements.length - 2);
        this.checkSegmentIntersections(this.trackElements.length - 2);
        this.checkPointAngle(this.trackElements.length - 2);
    }

    public updatePoint(index: number, intersection: THREE.Vector3) {
        this.trackElements[index].intersection = intersection;
        this.checkSegmentLength(this.trackElements.length - 2);
        this.checkSegmentLength(this.trackElements.length - 1);
        this.checkSegmentIntersections(this.trackElements.length - 2);
        this.checkSegmentIntersections(this.trackElements.length - 1);
        this.checkPointAngle(0);
        this.checkPointAngle(this.trackElements.length - 1);
        this.checkPointAngle(this.trackElements.length - 2);
    }

    public removeLastPoint() {
        this.trackElements.pop();
    }

    public checkSegmentLength(index: number) {

    }

    public checkSegmentIntersections(index: number) {
        const service = this;
        this.trackElements.forEach(
            (segment, i, segments) => {
                let clampDistances: number[] = [];

                const toCompare = {
                    line1: {
                        point1: segments[index].intersection,
                        point2: segments[index + 1 === segments.length ? 0 : index + 1].intersection
                    },
                    line2: {
                        point1: segments[i].intersection,
                        point2: segments[i + 1 === segments.length ? 0 : i + 1].intersection
                    }
                };
                const intersection = service.twoLineIntersection(toCompare.line1, toCompare.line2);
                // Evaluate for two paralele lines

                {
                    const distances: number[] = service.checkForClamp(intersection, toCompare.line1, toCompare.line2);
                    clampDistances = clampDistances.concat(distances);
                }
                {
                    const distances: number[] = service.checkForClamp(intersection, toCompare.line2, toCompare.line1);
                    clampDistances = clampDistances.concat(distances);
                }

                const minimumSegmentsDistance = clampDistances.length > 0 ? service.minimum(clampDistances) : 0;
                if (minimumSegmentsDistance < 25) {
                    if (-1 === segments[index].segmentIntersections.indexOf(i)) {
                        segments[index].segmentIntersections.push(i);
                        segments[i].segmentIntersections.push(index);
                    }
                } else {
                    const arrayPosition1 = segments[index].segmentIntersections.indexOf(i);
                    if (-1 < arrayPosition1) {
                        segments[index].segmentIntersections.splice(arrayPosition1, 1);
                        const arrayPosition2 = segments[i].segmentIntersections.indexOf(index);
                        segments[i].segmentIntersections.splice(arrayPosition2, 1);
                    }
                }
            }
        );
    }

    public checkForClamp(intersection, line1, line2): number[] {
        let distances: number[] = [];

        if (intersection.x < Math.min(line1.point1.x, line1.point2.x)) {

            const clampDistances = this.clampAndGetClosestPoints(Math.min(line1.point1.x, line1.point2.x), line1, line2);
            distances = distances.concat(clampDistances);

        } else if (intersection.x > Math.max(line1.point1.x, line1.point2.x)) {

            const clampDistances = this.clampAndGetClosestPoints(Math.max(line1.point1.x, line1.point2.x), line1, line2);
            distances = distances.concat(clampDistances);

        }

        return distances;
    }

    public clampAndGetClosestPoints(x, line1, line2): number[] {

        const lineParameters = this.getLineParameters(line1);
        const clampedPoint = {x, y: this.solveLineEquation(x, lineParameters)};

        const a = -1 / lineParameters.a;
        const permenticularParameters = {a, b: (clampedPoint.y - (a * clampedPoint.x))};

        const xOptimalOnLine2 = (permenticularParameters.b - lineParameters.b) / (lineParameters.a - permenticularParameters.a);
        const optimalPointOnLine2 = {x: xOptimalOnLine2, y: this.solveLineEquation(xOptimalOnLine2, permenticularParameters)};

        return this.findOptimalPoints(clampedPoint, line1, optimalPointOnLine2, line2);
    }

    public findOptimalPoints(clampedPoint, line1, optimalPointOnLine2, line2): number[] {
        let distances: number[] = [];
        if (
            Math.min(line2.point1.x, line2.point2.x) <= optimalPointOnLine2.x &&
            Math.max(line2.point1.x, line2.point2.x) >= optimalPointOnLine2.x
        ) {
            const clampToLineDistance = this.distance(clampedPoint, optimalPointOnLine2);
            distances.push(clampToLineDistance);
        } else {
            const endToEndDistances = this.getAllEndToEndDistances(line1, line2);
            distances = distances.concat(endToEndDistances);
        }
        return distances;
    }

    public solveLineEquation(x, lineParameters): number {
        return (lineParameters.a * x) + lineParameters.b;
    }

    public minimum(array: number[]): number {
        let minimum = array[0];
        array.forEach(
            (number) => {
                if (number < minimum) {
                    minimum = number;
                }
            }
        );
        return minimum;
    }

    public distance(point1: {x: number, y: number}, point2: {x: number, y: number}): number {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    public getLineParameters(line: {point1: {x: number, y: number}, point2: {x: number, y: number}}): {a: number, b: number} {
        const a = (line.point2.y - line.point1.y) / (line.point2.x - line.point1.x);
        const b = (line.point1.y - (a * line.point1.x));
        return {a, b};
    }

    public getAllEndToEndDistances(
        line1: {
            point1: { x: number, y: number },
            point2: { x: number, y: number }
        },
        line2: {
            point1: { x: number, y: number },
            point2: { x: number, y: number }
        }
    ): number[] {
        const distances: number[] = [];

        distances.push(this.distance( line1.point1, line2.point1 ));
        distances.push(this.distance( line1.point1, line2.point2 ));
        distances.push(this.distance( line1.point2, line2.point1 ));
        distances.push(this.distance( line1.point2, line2.point2 ));

        return distances;
    }

    public twoLineIntersection(
        line1: {point1: {x: number, y: number}, point2: {x: number, y: number}},
        line2: {point1: {x: number, y: number}, point2: {x: number, y: number}}
    ): {x: number, y: number} {
        const a1 = (line1.point2.y - line1.point1.y) / (line1.point2.x - line1.point1.x);
        const a2 = (line2.point2.y - line2.point1.y) / (line2.point2.x - line2.point1.x);

        if (a1 === a2) {
            return null;
        }

        const b1 = (line1.point1.y - (a1 * line1.point1.x));
        const b2 = (line2.point1.y - (a1 * line2.point1.x));

        const x = (b2 - b1) / (a1 - a2);
        const y = (a1 * x) + b1;

        return {x, y};
    }

    public checkPointAngle(index: number) {

    }

    public addObserver(observer: Observer) {
        this.observer = observer;
    }

    public notify() {
        this.observer.update();
    }
}
