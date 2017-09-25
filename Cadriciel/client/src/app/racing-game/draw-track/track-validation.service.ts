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



                const minimumSegmentsDistance = clampDistances.length > 0 ? service.minimum(clampDistances) : 0;
                if (minimumSegmentsDistance < 25) {

                    return;
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
        const b1 = (line1.point1.y - (a1 * line1.point1.x));

        const a2 = (line2.point2.y - line2.point1.y) / (line2.point2.x - line2.point1.x);
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
