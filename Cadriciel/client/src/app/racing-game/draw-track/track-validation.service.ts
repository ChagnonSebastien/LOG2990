import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class TrackValidationService {
    public trackElements: {
        intersection: THREE.Vector2,
        intersectionAngl: number,
        segmentLength: number,
        segmentIntersections: number[]
    }[] = [{ intersection: new THREE.Vector2(), intersectionAngl: 0, segmentLength: 0, segmentIntersections: [] }];

    private trackClosed = false;

    public addIntersection(intersection: THREE.Vector2) {
        this.trackElements.push(
            { intersection, intersectionAngl: 0, segmentLength: 0, segmentIntersections: [] }
        );
        this.checkSegmentLength(this.trackElements.length - 2);
        this.checkSegmentIntersections(this.trackElements.length - 2);
        if (this.trackElements.length > 2) {
            this.checkPointAngle(this.trackElements.length - 2, this.trackElements.length - 3);
        }
    }

    public clear() {
        this.trackElements = [{ intersection: new THREE.Vector2(), intersectionAngl: 0, segmentLength: 0, segmentIntersections: [] }];
        this.trackClosed = false;
    }

    public closeTrack() {
        this.trackElements.pop();
        this.trackClosed = true;
        this.checkPointAngle(0, this.trackElements.length - 1);
    }

    public openTrack(position: THREE.Vector2) {
        this.trackClosed = false;
        this.addIntersection(position);
        this.updatePoint(this.trackElements.length - 1, position);
    }

    public updatePoint(index: number, intersection: THREE.Vector2) {
        this.trackElements[index].intersection = intersection;
        this.checkSegmentLength(index);
        this.checkSegmentLength(index - 1 < 0 ? this.trackElements.length - 1 : index - 1);

        this.checkSegmentIntersections(index);
        this.checkSegmentIntersections(index - 1 < 0 ? this.trackElements.length - 1 : index - 1);

        if (this.trackElements.length < 3) {
            return;
        }

        this.checkPointAngle(
            index - 1 < 0 ? this.trackElements.length - 1 : index - 1,
            (index - 2 + this.trackElements.length) % this.trackElements.length
        );

        this.checkPointAngle(
            index,
            index - 1 === -1 ? this.trackElements.length - 1 : index - 1
        );
        if (this.distance(this.trackElements[0].intersection, this.trackElements[this.trackElements.length - 1].intersection) < 25) {
            this.checkPointAngle(index + 1 === this.trackElements.length ? 0 : index + 1, this.trackClosed ? index : index - 1);
        } else {
            if (!this.trackClosed) {
                this.trackElements[0].intersectionAngl = 0;
            }
            this.checkPointAngle(index + 1 === this.trackElements.length ? 0 : index + 1, index);
        }
    }

    public removeIntersection(mousePotition: THREE.Vector2) {
        this.trackElements.splice(this.trackElements.length - (this.trackClosed ? 1 : 2), 1);
        this.trackElements.forEach((segment, index, segments) => {
            const removedPosition = segment.segmentIntersections.indexOf(segments.length - 1);
            if (-1 < removedPosition) {
                segment.segmentIntersections.splice(removedPosition, 1);
            }
        });
        this.checkPointAngle(this.trackElements.length - 1, this.trackElements.length - 2);
        this.checkPointAngle(this.trackElements.length - 2, this.trackElements.length - 3);
        this.checkSegmentIntersections(this.trackElements.length - 2);
        this.updatePoint(this.trackElements.length - 1, mousePotition);
    }

    public checkSegmentLength(index: number) {
        let line;
        try {
            line = this.getLine(index);
        } catch (e) {
            this.trackElements[index].segmentLength = 0;
            return;
        }
        this.trackElements[index].segmentLength = this.distance(line.point1, line.point2);
    }

    public checkSegmentIntersections(index: number) {
        const service = this;
        this.trackElements.forEach(
            (segment, i, segments) => {
                if ((Math.abs(index - i) < 2 || Math.abs(index - i) === (segments.length - 1)) ||
                    (!service.trackClosed && (i === segments.length - 1 || index === segments.length - 1))) {
                    return;
                }

                if (i === 0 && service.distance(segments[0].intersection, segments[index + 1].intersection) < 25) {
                    service.updateSegmentsValidity(25 + 1, i, index);
                    return;
                }

                let line1;
                let line2;
                try {
                    line1 = service.getLine(index);
                    line2 = service.getLine(i);
                } catch (e) {
                    return;
                }
                const intersection = service.twoLineIntersection(this.getLineParameters(line1), this.getLineParameters(line2));

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

    public getLine(index) {
        const point1 = this.trackElements[index].intersection;
        const point2 = this.trackElements[index + 1 === this.trackElements.length ? 0 : index + 1].intersection;
        if (this.distance(point1, point2) === 0) {
            throw new Error();
        }

        return { point1, point2 };
    }

    public twoLineIntersection(line1, line2): { x: number, y: number } {
        if (line1.a === 0) {
            const x = ((line1.c * line2.b) - (line1.b * line2.c)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return { x, y: this.solveLineEquationWithX(x, line1) };
        } else {
            const y = ((line1.a * line2.c) - (line1.c * line2.a)) / ((line1.b * line2.a) - (line1.a * line2.b));
            return { x: this.solveLineEquationWithY(y, line1), y };
        }
    }

    public checkForClamp(intersection, line1, line2): number[] {
        const distance: number[] = [];

        if (
            Math.min(line1.point1.x, line1.point2.x) > intersection.x ||
            Math.max(line1.point1.x, line1.point2.x) < intersection.x ||
            Math.min(line1.point1.y, line1.point2.y) > intersection.y ||
            Math.max(line1.point1.y, line1.point2.y) < intersection.y
        ) {
            const optimalPoint = { x: NaN, y: NaN };
            optimalPoint.x = Math.abs(intersection.x - line1.point1.x) < Math.abs(intersection.x - line1.point2.x) ?
                line1.point1.x :
                line1.point2.x;
            optimalPoint.y = Math.abs(intersection.y - line1.point1.y) < Math.abs(intersection.y - line1.point2.y) ?
                line1.point1.y :
                line1.point2.y;

            distance.push(this.clampAndGetOptimalPoint(optimalPoint, line1, line2));
        }
        return distance;
    }

    public distanceToLine(point, line) {
        return this.distance(point, this.getNearestPointOnLine(point, line));
    }

    public getNearestPointOnLine(point, line) {
        const lineParameters = this.getLineParameters(line);
        const permenticularParameters = {
            a: lineParameters.b,
            b: -lineParameters.a,
            c: -((lineParameters.b * point.x) + (-lineParameters.a * point.y))
        };

        return this.twoLineIntersection(lineParameters, permenticularParameters);
    }

    public updateSegmentsValidity(minimumSegmentsDistance: number, index1: number, index2: number) {
        if (minimumSegmentsDistance < 25) {
            if (-1 === this.trackElements[index2].segmentIntersections.indexOf(index1)) {
                this.trackElements[index2].segmentIntersections.push(index1);
                this.trackElements[index1].segmentIntersections.push(index2);
            }
        } else {
            const arrayPosition1 = this.trackElements[index2].segmentIntersections.indexOf(index1);
            if (-1 < arrayPosition1) {
                this.trackElements[index2].segmentIntersections.splice(arrayPosition1, 1);
                const arrayPosition2 = this.trackElements[index1].segmentIntersections.indexOf(index2);
                this.trackElements[index1].segmentIntersections.splice(arrayPosition2, 1);
            }
        }
    }

    public clampAndGetOptimalPoint(clampedPoint, line1, line2): number {
        const optimalPoint = this.getNearestPointOnLine(clampedPoint, line2);
        return this.findOptimalPoint(clampedPoint, line1, optimalPoint, line2);
    }

    public findOptimalPoint(clampedPoint, line1, optimalPoint, line2): number {
        let distances: number[] = [];
        if (
            Math.min(line2.point1.x, line2.point2.x) <= optimalPoint.x &&
            Math.max(line2.point1.x, line2.point2.x) >= optimalPoint.x &&
            Math.min(line2.point1.y, line2.point2.y) <= optimalPoint.y &&
            Math.max(line2.point1.y, line2.point2.y) >= optimalPoint.y
        ) {
            const clampToOptimalDistance = this.distance(clampedPoint, optimalPoint);
            distances.push(clampToOptimalDistance);
        } else {
            const endToEndDistances = this.getAllEndToEndDistances(line1, line2);
            distances = distances.concat(endToEndDistances);
        }
        return this.minimum(distances);
    }

    public solveLineEquationWithX(x, lineParameters): number {
        return ((lineParameters.a * x) + lineParameters.c) / -lineParameters.b;
    }

    public solveLineEquationWithY(y, lineParameters): number {
        return ((lineParameters.b * y) + lineParameters.c) / -lineParameters.a;
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

    public distance(point1: { x: number, y: number }, point2: { x: number, y: number }): number {
        return Math.sqrt(
            Math.pow((point1.x - point2.x), 2) +
            Math.pow((point1.y - point2.y), 2)
        );
    }

    public getLineParameters(line): { a: number, b: number, c: number } {
        const a = line.point1.y - line.point2.y;
        const b = line.point2.x - line.point1.x;
        const c = (line.point1.x * line.point2.y) - (line.point2.x * line.point1.y);
        return { a, b, c };
    }

    public getAllEndToEndDistances(line1, line2): number[] {
        const distances: number[] = [];

        distances.push(this.distance(line1.point1, line2.point1));
        distances.push(this.distance(line1.point1, line2.point2));
        distances.push(this.distance(line1.point2, line2.point1));
        distances.push(this.distance(line1.point2, line2.point2));

        return distances;
    }

    public checkPointAngle(index1: number, index2: number) {
        if (!this.trackClosed && (index2 === this.trackElements.length - 1 || index1 === this.trackElements.length - 1) ||
            index1 < 0 || index2 < 0) {
            return;
        }

        let line1;
        let line2;
        try {
            line1 = this.getLine(index1);
            line2 = this.getLine(index2);
        } catch (e) {
            return;
        }

        const angle1 = this.getAngle(line1);
        const angle2 = this.getAngle(line2);
        const rawAngleVariation = angle2 - angle1 + (Math.PI / 2);
        const angleVariation = (rawAngleVariation + (2 * Math.PI)) % (2 * Math.PI);
        this.trackElements[index1].intersectionAngl = angleVariation;
    }

    public getAngle(line): number {
        const rawAngle = Math.atan((line.point2.y - line.point1.y) / (line.point2.x - line.point1.x));
        return (line.point2.x - line.point1.x >= 0) ? rawAngle : rawAngle + Math.PI;
    }

    public isValid(index: number) {
        return (
            this.isLengthValid(index) &&
            this.isSegmentsIntersectionValid(index) &&
            this.isFirstAngleValid(index) &&
            this.isSecondAngleValid(index)
        );
    }

    private isLengthValid(index: number) {
        return this.trackElements[index].segmentLength >= 40;
    }

    private isSegmentsIntersectionValid(index: number) {
        return this.trackElements[index].segmentIntersections.length === 0;
    }

    private isFirstAngleValid(index: number) {
        return this.trackElements[index].intersectionAngl <= Math.PI;
    }

    private isSecondAngleValid(index: number) {
        let nextSegment = index + 1 < this.trackElements.length ? index + 1 : 0;
        if (!this.trackClosed && index === this.trackElements.length - 2) {
            if (this.trackElements[index + 1].segmentLength >= 25) {
                return true;
            }
            nextSegment = 0;
        }

        return this.trackElements[nextSegment].intersectionAngl <= Math.PI;
    }

    public isAllValid() {
        let valid = true;
        for ( let i = 0; i < this.trackElements.length; i++ ) {
            valid = valid && this.isValid(i);
        }
        return valid;
    }
}
