import { TestBed, inject } from '@angular/core/testing';
import { ObstacleService } from './obstacle.service';
import { Obstacle, ObstacleType } from './obstacle';
import { TrackValidationService } from './track-validation.service';
import { RenderService } from './render.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const viewDepth = 10;

let renderService: RenderService;

fdescribe('Draw Track Render', () => {

      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [RenderService]
        });
        renderService = TestBed.get(RenderService);
    });

    it('Render creation', () => {
        expect(renderService).toBeDefined();
    });

    it('Clear intersections, segments', () => {
        renderService.clear();
        expect(renderService['intersections']).toEqual([]);
        expect(renderService['segments']).toEqual([]);
        expect(renderService.trackClosed).toEqual(false);
    });
});
