import { Obstacle, ObstacleType } from './obstacle';
import { MockBackend } from '@angular/http/testing';
import { async, fakeAsync, tick } from '@angular/core/testing';
import { ObstacleService } from './obstacle.service';
import { RenderService } from './render.service';
import { TrackValidationService } from './track-validation.service';
import { DrawTrackService } from './draw-track.service';
import {
    Http,
    Response,
    RequestOptions,
    BaseRequestOptions,
    ResponseOptions,
    ConnectionBackend
} from '@angular/http';
import { ReflectiveInjector } from '@angular/core';
import * as THREE from 'three';



describe('test drawTrackService', function () {

    const renderServiceStub = {};
    const trackValidationServiceStub = {};
    const obstacleServiceStub = {
        getObstacles(type: ObstacleType): Obstacle[] {
            return [];
        }
    };

    beforeEach(async(() => {
        this.injector = ReflectiveInjector.resolveAndCreate([
            { provide: ConnectionBackend, useClass: MockBackend },
            { provide: RequestOptions, useClass: BaseRequestOptions },
            { provide: TrackValidationService, useValue: trackValidationServiceStub },
            { provide: RenderService, useValue: renderServiceStub },
            { provide: ObstacleService, useValue: obstacleServiceStub },
            Http,
            DrawTrackService
        ]);
        this.drawTrackService = this.injector.get(DrawTrackService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => this.lastConnection = connection);
    }));

    it('should be created', () => {
        expect(this.drawTrackService).toBeTruthy();
    });

    it('should be able to definie if loop is closed', () => {
        this.drawTrackService.trackClosed = false;
        expect(this.drawTrackService.isFinished()).toEqual(false);
    });

    it('should be able to calculate distance between two points', () => {
        const vector1 = new THREE.Vector2(1, 1);
        const vector2 = new THREE.Vector2(1, 2);
        expect(this.drawTrackService.getXYDistance(vector1, vector2)).toEqual(1);
    });

    it('should be able to calculates the relative position', () => {
        const vector1 = new THREE.Vector2(1, 1);
        const vector2 = new THREE.Vector2(1, 2);
        expect(this.drawTrackService.getXYDistance(vector1, vector2)).toEqual(1);
    });

    it('should be able to post to the server a track and receive a response', fakeAsync(() => {
        let result: String;

        this.drawTrackService.saveTrack('name', 'description', 'difficulty').then((serverResponse: String) => result = serverResponse);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify({ data: 'success' }),
        })));
        tick();
        expect(result).toBe('success');
    }));
});
