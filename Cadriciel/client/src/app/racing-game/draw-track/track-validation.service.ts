import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface Observer {
    update(index: number, valid: boolean): void;
}

@Injectable()
export class TrackValidationService {
    public trackElements: {
        intersection: THREE.Vector3,
        intersectionAngle: boolean,
        segmentLengthValid: boolean,
        segmentIntersections: number[]
    }[] = [{ intersection: new THREE.Vector3(), intersectionAngle: false, segmentLengthValid: false, segmentIntersections: [] }];

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
        console.log(this.trackElements);
        this.trackElements[index].intersection = intersection;
        this.checkSegmentLength(this.trackElements.length - 2);
        this.checkSegmentLength(this.trackElements.length - 1);
        console.log(index);
        console.log(index - 1 < 0 ? this.trackElements.length - 1 : index - 1);
        this.checkSegmentIntersections(index);
        this.checkSegmentIntersections(index - 1 < 0 ? this.trackElements.length - 1 : index - 1);
        this.notify(index);
        this.notify(index - 1 < 0 ? this.trackElements.length - 1 : index - 1);
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

                if ( Math.abs(index - i) < 2 || Math.abs(index - i) === (segments.length - 1) ) {
                    return;
                }

                const line1 = service.getLine(index, segments);
                const line2 = service.getLine(i, segments);
                const intersection = service.twoLineIntersection(line1, line2);
                // Evaluate for two paralele lines

                let clampDistances: number[] = [];
                const optimisedDistancesLine1: number[] = service.checkForClamp(intersection, line1, line2);
                clampDistances = clampDistances.concat(optimisedDistancesLine1);
                const optimisedDistancesLine2: number[] = service.checkForClamp(intersection, line2, line1);
                clampDistances = clampDistances.concat(optimisedDistancesLine2);

                const minimumSegmentsDistance = clampDistances.length > 0 ? service.minimum(clampDistances) : 0;
                service.updateSegmentsValidity(minimumSegmentsDistance, i, index);
            }
        );
    }

    public getLine(index, segments) {
        return {
            point1: segments[index].intersection,
            point2: segments[index + 1 === segments.length ? 0 : index + 1].intersection
        };
    }

    public twoLineIntersection( line1, line2 ): {x: number, y: number} {
        const lineParameters1 = this.getLineParameters(line1);
        const lineParameters2 = this.getLineParameters(line2);

        if (lineParameters1.a === lineParameters2.a) {
            throw new Error();
        }

        const x = (lineParameters2.b - lineParameters1.b) / (lineParameters1.a - lineParameters2.a);
        return {x, y: this.solveYIntercept(x, lineParameters1)};
    }

    public checkForClamp(intersection, line1, line2): number[] {
        let distances: number[] = [];

        if (intersection.x < Math.min(line1.point1.x, line1.point2.x)) {
            const clampDistances = this.clampAndGetOptimalPoints(Math.min(line1.point1.x, line1.point2.x), line1, line2);
            distances = distances.concat(clampDistances);

        } else if (intersection.x > Math.max(line1.point1.x, line1.point2.x)) {
            const clampDistances = this.clampAndGetOptimalPoints(Math.max(line1.point1.x, line1.point2.x), line1, line2);
            distances = distances.concat(clampDistances);

        }

        return distances;
    }

    public updateSegmentsValidity(minimumSegmentsDistance: number, index1: number, index2: number) {
        if (minimumSegmentsDistance < 25) {
            if (-1 === this.trackElements[index2].segmentIntersections.indexOf(index1)) {
                this.trackElements[index2].segmentIntersections.push(index1);
                this.trackElements[index1].segmentIntersections.push(index2);
            }
            console.log('DO: ', index1,  ' ', index2, minimumSegmentsDistance);
        } else {
            const arrayPosition1 = this.trackElements[index2].segmentIntersections.indexOf(index1);
            if (-1 < arrayPosition1) {
                this.trackElements[index2].segmentIntersections.splice(arrayPosition1, 1);
                const arrayPosition2 = this.trackElements[index1].segmentIntersections.indexOf(index2);
                this.trackElements[index1].segmentIntersections.splice(arrayPosition2, 1);
            }
            console.log('DON\'T: ', index1,  ' ', index2, minimumSegmentsDistance);
        }
    }

    public clampAndGetOptimalPoints(x, line1, line2): number[] {

        const lineParameters = this.getLineParameters(line1);
        const clampedPoint = {x, y: this.solveLineEquation(x, lineParameters)};

        const slope = -1 / lineParameters.a;
        const permenticularParameters = {a: slope, b: this.solveYIntercept(clampedPoint, slope)};

        const xOptimal = (permenticularParameters.b - lineParameters.b) / (lineParameters.a - permenticularParameters.a);
        const optimalPoint = {x: xOptimal, y: this.solveLineEquation(xOptimal, permenticularParameters)};

        return this.findOptimalPoints(clampedPoint, line1, optimalPoint, line2);
    }

    public findOptimalPoints(clampedPoint, line1, optimalPoint, line2): number[] {
        let distances: number[] = [];
        if (
            Math.min(line2.point1.x, line2.point2.x) <= optimalPoint.x &&
            Math.max(line2.point1.x, line2.point2.x) >= optimalPoint.x
        ) {
            const clampToOptimalDistance = this.distance(clampedPoint, optimalPoint);
            distances.push(clampToOptimalDistance);
        } else {
            const endToEndDistances = this.getAllEndToEndDistances(line1, line2);
            distances = distances.concat(endToEndDistances);
        }
        return distances;
    }

    public solveYIntercept(point, slope): number {
        return (point.y - (slope * point.x));
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

    public getLineParameters( line ): {a: number, b: number} {
        const a = (line.point2.y - line.point1.y) / (line.point2.x - line.point1.x);
        const b = (line.point1.y - (a * line.point1.x));
        return {a, b};
    }

    public getAllEndToEndDistances( line1, line2 ): number[] {
        const distances: number[] = [];

        distances.push(this.distance( line1.point1, line2.point1 ));
        distances.push(this.distance( line1.point1, line2.point2 ));
        distances.push(this.distance( line1.point2, line2.point1 ));
        distances.push(this.distance( line1.point2, line2.point2 ));

        return distances;
    }

    public checkPointAngle(index: number) {

    }

    public addObserver(observer: Observer) {
        this.observer = observer;
    }

    public notify(index: number) {
        if (index < this.trackElements.length  && index > -1) {
            this.observer.update(index, this.trackElements[index].segmentIntersections.length === 0);
        }
    }
}
