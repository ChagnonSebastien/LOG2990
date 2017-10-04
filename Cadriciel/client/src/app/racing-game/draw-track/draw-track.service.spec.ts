import { TrackValidationService } from './track-validation.service';
import { DrawTrackService } from './draw-track.service';
import { TestBed, inject } from '@angular/core/testing';
import * as THREE from 'three';

describe('test drawTrackService', function() {
    let drawTrackService: DrawTrackService;
    beforeEach(() => {
        drawTrackService = new DrawTrackService(new TrackValidationService());
    });

    it('construction test', done => {
        expect(drawTrackService).toBeTruthy();
        done();
    });

    it('Able to definie if loop is closed', done => {
        drawTrackService.loopClosed = false;
        expect(drawTrackService.isFinished()).toEqual(false);
        done();
    });

    it('Calculate distance between two points', done => {
        const vector1 = new THREE.Vector3(1, 1, 0);
        const vector2 = new THREE.Vector3(1, 2, 0);
        expect(drawTrackService.getXYDistance(vector1, vector2)).toEqual(1);
        done();
    });

    it('Calculates the relative position', done => {
        const vector1 = new THREE.Vector3(1, 1, 0);
        const vector2 = new THREE.Vector3(1, 2, 0);
        expect(drawTrackService.getXYDistance(vector1, vector2)).toEqual(1);
        done();
    });
});
