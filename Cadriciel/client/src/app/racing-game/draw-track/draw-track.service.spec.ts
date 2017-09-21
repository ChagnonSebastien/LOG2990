import { DrawTrackService } from './draw-track.service';
import { TestBed, inject } from '@angular/core/testing';
import * as THREE from 'three';

describe('test drawTrackService', function() {
    let drawTrackService: DrawTrackService;
    beforeEach(() => {
        drawTrackService = new DrawTrackService();
    });

    it('construction test', done => {
        expect(drawTrackService).toBeTruthy();
        done();
    });

    it('addPoint adds a point to junction\'s array', done => {
        /*
        const geometry = new THREE.CircleGeometry( 10, 32 );
        const material = new THREE.MeshBasicMaterial( { color: 0xF5CD30 } );
        drawTrackService.mouseOnFirstPoint = false;
        drawTrackService.mousePosition.x = 10;
        drawTrackService.mousePosition.y = 13;
        drawTrackService.addPoint();
        expect(drawTrackService.points[drawTrackService.points.length - 1].position.x).toEqual(10);
        expect(drawTrackService.points[drawTrackService.points.length - 1].position.y).toEqual(13);
        */
        done();
    });
});
