import { Injectable } from '@angular/core';
import * as THREE from 'three';

export interface Observer {
    update(): void;
}

@Injectable()
export class TrackValidationService {

    public trackElements: {intersection: THREE.Vector3, intersectionValid: boolean, segmentValid: boolean}[] = [];

    public trackClosed = false;

    constructor(public observer: Observer) {}

    public addPoint(intersection: THREE.Vector3) {
        this.trackElements.push( { intersection: intersection, intersectionValid: false, segmentValid: false } );
        this.checkSegment(this.trackElements.length - 2);
        this.checkSegment(this.trackElements.length - 1);
        this.checkPoint(this.trackElements.length - 1);
    }

    public updatePoint(index: number, intersection: THREE.Vector3) {
        this.trackElements[index].intersection = intersection;
    }

    public removeLastPoint() {
        this.trackElements.pop();
    }

    public checkSegment(index: number) {

    }

    public checkPoint(index: number) {

    }

    public notify() {
        this.observer.update();
    }
}
