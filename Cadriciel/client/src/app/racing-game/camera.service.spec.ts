import { CameraService } from './camera.service';
import { TestBed, inject } from '@angular/core/testing';
import * as THREE from 'three';

describe('test drawTrackService', function() {
    let cameraService: CameraService;
    beforeEach(() => {
        cameraService = new CameraService();
    });

    it('construction test', done => {
        expect(cameraService).toBeTruthy();
        done();
    });

    it('calculate ratio of window', done => {
        const number1 = 10;
        const number2 = 10;
        expect(cameraService.getAspectRatio(number1, number2)).toEqual(1);
        done();
    });
});
