import { ObstacleService } from './obstacle.service';
import { RenderService } from './render.service';
import { TrackValidationService } from './track-validation.service';
import { DrawTrackService } from './draw-track.service';
import {
    Http,
    BrowserXhr,
    RequestOptions,
    BaseRequestOptions,
    ResponseOptions,
    BaseResponseOptions,
    ConnectionBackend,
    XHRBackend,
    XSRFStrategy,
    CookieXSRFStrategy
} from '@angular/http';
import { ReflectiveInjector } from '@angular/core';
import * as THREE from 'three';

describe('test drawTrackService', function () {
    let drawTrackService: DrawTrackService;
    beforeEach(() => {
        const injector = ReflectiveInjector.resolveAndCreate([
            Http,
            BrowserXhr,
            { provide: RequestOptions, useClass: BaseRequestOptions },
            { provide: ResponseOptions, useClass: BaseResponseOptions },
            { provide: ConnectionBackend, useClass: XHRBackend },
            { provide: XSRFStrategy, useFactory: () => new CookieXSRFStrategy() },
        ]);
        const http = injector.get(Http);
        drawTrackService = new DrawTrackService(new RenderService(), new TrackValidationService(), new ObstacleService(), http);
    });

    it('construction test', done => {
        expect(drawTrackService).toBeTruthy();
        done();
    });

    it('Able to definie if loop is closed', done => {
        drawTrackService.trackClosed = false;
        expect(drawTrackService.isFinished()).toEqual(false);
        done();
    });

    it('Calculate distance between two points', done => {
        const vector1 = new THREE.Vector2(1, 1);
        const vector2 = new THREE.Vector2(1, 2);
        expect(drawTrackService.getXYDistance(vector1, vector2)).toEqual(1);
        done();
    });

    it('Calculates the relative position', done => {
        const vector1 = new THREE.Vector2(1, 1);
        const vector2 = new THREE.Vector2(1, 2);
        expect(drawTrackService.getXYDistance(vector1, vector2)).toEqual(1);
        done();
    });
});
