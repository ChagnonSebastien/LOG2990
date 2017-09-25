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
                const clampDistances: number[] = [];

                const toCompare = {
                    line1: {
                        point1: {
                            x: segments[index].intersection.x,
                            y: segments[index].intersection.y
                        },
                        point2: {
                            x: segments[index + 1 === segments.length ? 0 : index + 1].intersection.x,
                            y: segments[index + 1 === segments.length ? 0 : index + 1].intersection.y
                        }
                    },
                    line2: {
                        point1: {
                            x: segments[i].intersection.x,
                            y: segments[i].intersection.y
                        },
                        point2: {
                            x: segments[index + 1 === segments.length ? 0 : index + 1].intersection.x,
                            y: segments[index + 1 === segments.length ? 0 : index + 1].intersection.y
                        }
                    }
                };
                const intersection = service.twoLineIntersection(toCompare.line1, toCompare.line2);
                // Evaluate for two paralele lines

                if (intersection.x < Math.min(toCompare.line1.point1.x, toCompare.line1.point2.x)) {
                    const x = Math.min(toCompare.line1.point1.x, toCompare.line1.point2.x);
                    const a = (toCompare.line1.point2.y - toCompare.line1.point1.y) / (toCompare.line1.point2.x - toCompare.line1.point1.x);
                    const b = (toCompare.line1.point1.y - (a * toCompare.line1.point1.x));
                    const y = (a * x) + b;

                    const ai = -1 / a;
                    const bi = (y - (ai * x));
                    const xi = (bi - b) / (a - ai);

                    if (
                        Math.min(toCompare.line2.point1.x, toCompare.line2.point2.x) <= xi &&
                        Math.max(toCompare.line2.point1.x, toCompare.line2.point2.x) >= xi
                    ) {
                        const yi = (a * x) + b;
                        const distance = Math.sqrt(Math.pow((xi - x), 2) + Math.pow((yi - y), 2));
                        clampDistances.push(distance);
                    } else {
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point2.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point2.y), 2)
                        ));
                    }
                } else if (intersection.x > Math.max(toCompare.line1.point1.x, toCompare.line1.point2.x)) {
                    const x = Math.max(toCompare.line1.point1.x, toCompare.line1.point2.x);
                    const a = (toCompare.line1.point2.y - toCompare.line1.point1.y) / (toCompare.line1.point2.x - toCompare.line1.point1.x);
                    const b = (toCompare.line1.point1.y - (a * toCompare.line1.point1.x));
                    const y = (a * x) + b;

                    const ai = -1 / a;
                    const bi = (y - (ai * x));
                    const xi = (bi - b) / (a - ai);

                    if (
                        Math.min(toCompare.line2.point1.x, toCompare.line2.point2.x) <= xi &&
                        Math.max(toCompare.line2.point1.x, toCompare.line2.point2.x) >= xi
                    ) {
                        const yi = (a * x) + b;
                        const distance = Math.sqrt(Math.pow((xi - x), 2) + Math.pow((yi - y), 2));
                        clampDistances.push(distance);
                    } else {
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point2.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point2.y), 2)
                        ));
                    }
                }

                if (intersection.x < Math.min(toCompare.line2.point1.x, toCompare.line2.point2.x)) {
                    const x = Math.min(toCompare.line2.point1.x, toCompare.line2.point2.x);
                    const a = (toCompare.line2.point2.y - toCompare.line2.point1.y) / (toCompare.line2.point2.x - toCompare.line2.point1.x);
                    const b = (toCompare.line2.point1.y - (a * toCompare.line2.point1.x));
                    const y = (a * x) + b;

                    const ai = -1 / a;
                    const bi = (y - (ai * x));
                    const xi = (bi - b) / (a - ai);

                    if (
                        Math.min(toCompare.line2.point1.x, toCompare.line2.point2.x) <= xi &&
                        Math.max(toCompare.line2.point1.x, toCompare.line2.point2.x) >= xi
                    ) {
                        const yi = (a * x) + b;
                        const distance = Math.sqrt(Math.pow((xi - x), 2) + Math.pow((yi - y), 2));
                        clampDistances.push(distance);
                    } else {
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point2.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point2.y), 2)
                        ));
                    }
                } else if (intersection.x > Math.max(toCompare.line2.point1.x, toCompare.line2.point2.x)) {
                    const x = Math.max(toCompare.line2.point1.x, toCompare.line2.point2.x);
                    const a = (toCompare.line2.point2.y - toCompare.line2.point1.y) / (toCompare.line2.point2.x - toCompare.line2.point1.x);
                    const b = (toCompare.line2.point1.y - (a * toCompare.line2.point1.x));
                    const y = (a * x) + b;

                    const ai = -1 / a;
                    const bi = (y - (ai * x));
                    const xi = (bi - b) / (a - ai);

                    if (
                        Math.min(toCompare.line2.point1.x, toCompare.line2.point2.x) <= xi &&
                        Math.max(toCompare.line2.point1.x, toCompare.line2.point2.x) >= xi
                    ) {
                        const yi = (a * x) + b;
                        const distance = Math.sqrt(Math.pow((xi - x), 2) + Math.pow((yi - y), 2));
                        clampDistances.push(distance);
                    } else {
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point1.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point1.y - toCompare.line2.point2.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point1.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point1.y), 2)
                        ));
                        clampDistances.push(Math.sqrt(
                            Math.pow((toCompare.line1.point2.x - toCompare.line2.point2.x), 2) +
                            Math.pow((toCompare.line1.point2.y - toCompare.line2.point2.y), 2)
                        ));
                    }
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
