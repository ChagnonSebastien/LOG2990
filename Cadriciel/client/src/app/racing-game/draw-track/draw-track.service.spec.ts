import { Track } from './../track';
import { TrackService } from './../game-initialization/track.service';
import { Obstacle, ObstacleType } from './obstacle';
import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { ObstacleService } from './obstacle.service';
import { RenderService } from './render.service';
import { TrackValidationService } from './track-validation.service';
import { DrawTrackService } from './draw-track.service';
import { HttpModule } from '@angular/http';
import * as THREE from 'three';

class MockTrackService extends TrackService {
    public save(track: Track): Promise<string> {
        return Promise.resolve('success');
    }

    public get(trackName: string): Promise<Track> {
        return Promise.resolve( new Track(
            'name',
            'description',
            'type',
            [new THREE.Vector2(0, 0), new THREE.Vector2(100, 100), new THREE.Vector2(0, 200)],
            [new Obstacle(ObstacleType.Puddle, 1, 0.4, 0.3)],
            [],
            [
                new Obstacle(ObstacleType.Booster, 2, 0.3, 0.9),
                new Obstacle(ObstacleType.Booster, 1, 0.2, 0.7),
                new Obstacle(ObstacleType.Booster, 2, 0.1, 0.3)
            ]
        ));
    }
}

class MockRenderService extends RenderService {
    public initialise(container, trackValidationService, obstacleService) {
        this['trackValidationService'] = trackValidationService;
        this['obstacleService'] = obstacleService;
    }

    public addIntersection(mousePosition) {}
    public closeTrack() {}
    public removeIntersection() {}
    public openTrack(mousePosition) {}
    public updateObstaclesPositions() {}
    public onResize() { return true; }
}

let drawTrackService;

describe('DrawTrackService', function () {

    beforeAll(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                DrawTrackService,
                TrackValidationService,
                ObstacleService,
                { provide: RenderService, useClass: MockRenderService },
                { provide: TrackService, useClass: MockTrackService },
            ]
        });
        drawTrackService = TestBed.get(DrawTrackService);
        drawTrackService.initialise(document.createElement('div'));
    });

    it('should be created', () => {
        expect(drawTrackService).toBeTruthy();
    });

    describe('initialise()', function () {

        it('should prepare it\'s RenderService', () => {
            expect(drawTrackService['renderService']['obstacleService'] === drawTrackService['obstacleService']).toBeTruthy();
            expect(drawTrackService['renderService']['trackValidationService'] === drawTrackService['trackValidationService']).toBeTruthy();
        });

        it('should prepare it\'s ObstacleService', () => {
            expect(drawTrackService['obstacleService']['track'] === drawTrackService['intersections']).toBeTruthy();
        });
    });

    describe('addIntersection()', function () {

        it('should add a new intersection', () => {
            drawTrackService.addIntersection();
            expect(drawTrackService['intersections'].length).toEqual(2);
        });

        it('the new intersection should be at the mouse position', () => {
            expect(drawTrackService['intersections'][0].x).toEqual(0);
            expect(drawTrackService['intersections'][0].y).toEqual(0);
        });

        it('the new last point should be at the mouse position', () => {
            expect(drawTrackService['intersections'][1].x).toEqual(0);
            expect(drawTrackService['intersections'][1].y).toEqual(0);
        });
    });

    describe('updateRealMousePosition()', function () {

        it('should update the last intersection\'s position', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(123, 3456);
            drawTrackService.updateRealMousePosition();
            expect(drawTrackService['intersections'][1].x).toEqual(123);
            expect(drawTrackService['intersections'][1].y).toEqual(3456);
        });

        it('should detect if the mouse is not above any point', () => {
            expect(drawTrackService['pointMouseHoversOn']).toEqual(-1);
        });

        it('should detect if the mouse is above a point', () => {
            drawTrackService.addIntersection();
            drawTrackService['mousePosition'] = new THREE.Vector2(-1, 9);
            drawTrackService.updateRealMousePosition();
            expect(drawTrackService['pointMouseHoversOn']).toEqual(0);
        });
    });

    describe('addIntersection() pt2', function () {

        it('should not add a new intersection nor close the track if the mouse is on the first point and there are 1 or 2 points', () => {
            expect(drawTrackService['intersections'].length).toEqual(3);
            drawTrackService.addIntersection();
            expect(drawTrackService['intersections'].length).toEqual(3);
            expect(drawTrackService['trackClosed']).toBeFalsy();
        });

        it('should not add a point above any other point', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(34, 56);
            drawTrackService.updateRealMousePosition();
            expect(drawTrackService['intersections'].length).toEqual(3);
            drawTrackService.addIntersection();
            expect(drawTrackService['intersections'].length).toEqual(4);
            drawTrackService['mousePosition'] = new THREE.Vector2(123, 3456);
            drawTrackService.updateRealMousePosition();
            expect(drawTrackService['intersections'].length).toEqual(4);
            drawTrackService.addIntersection();
            expect(drawTrackService['intersections'].length).toEqual(4);
        });
    });

    describe('removeIntersection()', function () {

        it('should remove the last intersection', () => {
            expect(drawTrackService['intersections'].length).toEqual(4);
            drawTrackService.removeIntersection();
            expect(drawTrackService['intersections'].length).toEqual(3);
        });

        it('should leave the active point at the mouse position', () => {
            drawTrackService.removeIntersection();
            drawTrackService.removeIntersection();
            expect(drawTrackService['intersections'][0].x).toEqual(123);
            expect(drawTrackService['intersections'][0].y).toEqual(3456);
        });

        it('should not remove any point if there is only the active point', () => {
            expect(drawTrackService['intersections'].length).toEqual(1);
            drawTrackService.removeIntersection();
            expect(drawTrackService['intersections'].length).toEqual(1);
        });
    });

    describe('updateRealMousePosition() pt2', function () {

        beforeAll(() => {
            drawTrackService['mousePosition'] = new THREE.Vector2(0, 0);
            drawTrackService.updateRealMousePosition();
            drawTrackService.addIntersection();
            drawTrackService['mousePosition'] = new THREE.Vector2(200, 200);
            drawTrackService.updateRealMousePosition();
            drawTrackService.addIntersection();
            drawTrackService['mousePosition'] = new THREE.Vector2(0, 200);
            drawTrackService.updateRealMousePosition();
            drawTrackService.addIntersection();
        });

        it('should snap to the first point when there are more than 2 points', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(4, 4);
            drawTrackService.updateRealMousePosition();
            expect(drawTrackService['mousePosition'].x).toEqual(0);
            expect(drawTrackService['mousePosition'].y).toEqual(0);
        });

    });

    describe('addIntersection() pt3', function () {

        it('should close the track and remove the moving point if the mouse is on the first point and there are more than 2 points', () => {
            expect(drawTrackService['intersections'].length).toEqual(4);
            drawTrackService.addIntersection();
            expect(drawTrackService['intersections'].length).toEqual(3);
            expect(drawTrackService['trackClosed']).toBeTruthy();
        });

    });

    describe('removeIntersection() pt2', function () {

        it('should reopen the track if it was closed and re-add the active point', () => {
            expect(drawTrackService['intersections'].length).toEqual(3);
            drawTrackService.removeIntersection();
            expect(drawTrackService['intersections'].length).toEqual(4);
            expect(drawTrackService['trackClosed']).toBeFalsy();
        });
    });

    describe('isFinished()', function () {

        it('should be able to return if loop is open', () => {
            expect(drawTrackService.isFinished()).toBeFalsy();
        });

        it('should be able to return if loop is closed', () => {
            drawTrackService.addIntersection();
            expect(drawTrackService.isFinished()).toBeTruthy();
        });
    });

    describe('startDrag()', function () {

        it('should do nothing if the cursor is not on any point', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(-100, 1);
            drawTrackService.updateRealMousePosition();
            drawTrackService.startDrag();
            expect(drawTrackService['currentlyDraggedIntersection']).toEqual(-1);
        });

        it('should recognise the point the mouse is over to start dragging', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(0, 0);
            drawTrackService.updateRealMousePosition();
            drawTrackService.startDrag();
            expect(drawTrackService['currentlyDraggedIntersection']).toEqual(0);
        });

        it('should drag the point with the mouse after startDrag() have been called', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(100, 12222);
            drawTrackService.updateRealMousePosition();
            drawTrackService.startDrag();
            expect(drawTrackService['intersections'][0].x).toEqual(100);
            expect(drawTrackService['intersections'][0].y).toEqual(12222);
        });
    });

    describe('endDrag()', function () {

        it('should remove the dragged point from it\'s dragged point variable', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(0, 0);
            drawTrackService.updateRealMousePosition();
            drawTrackService.endDrag();
            expect(drawTrackService['currentlyDraggedIntersection']).toEqual(-1);
        });

        it('should stop dragging the point whan the mouse moves', () => {
            drawTrackService['mousePosition'] = new THREE.Vector2(100, 12222);
            drawTrackService.updateRealMousePosition();
            drawTrackService.startDrag();
            expect(drawTrackService['intersections'][0].x).toEqual(0);
            expect(drawTrackService['intersections'][0].y).toEqual(0);
        });

        it('should do nothing if no point is beoing dragged', () => {
            drawTrackService.endDrag();
            expect(drawTrackService['currentlyDraggedIntersection']).toEqual(-1);
        });
    });

    describe('addObstacle()', function () {

        it('should add an obstacle of a any type', () => {
            drawTrackService.addObstacle(ObstacleType.Booster);
            expect(drawTrackService['obstacleService']['potholes'].length).toEqual(0);
            expect(drawTrackService['obstacleService']['puddles'].length).toEqual(0);
            expect(drawTrackService['obstacleService']['boosters'].length).toEqual(1);
            drawTrackService.addObstacle(ObstacleType.Pothole);
            expect(drawTrackService['obstacleService']['potholes'].length).toEqual(1);
            expect(drawTrackService['obstacleService']['puddles'].length).toEqual(0);
            expect(drawTrackService['obstacleService']['boosters'].length).toEqual(1);
            drawTrackService.addObstacle(ObstacleType.Puddle);
            expect(drawTrackService['obstacleService']['potholes'].length).toEqual(1);
            expect(drawTrackService['obstacleService']['puddles'].length).toEqual(1);
            expect(drawTrackService['obstacleService']['boosters'].length).toEqual(1);
        });
    });

    describe('randomizeAllPositions()', function () {

        it('should randomize the position of all obstacles of any type', () => {
            const previousPothole: Obstacle = drawTrackService['obstacleService']['potholes'][0];
            drawTrackService.randomizeAllPositions(ObstacleType.Pothole);
            expect(drawTrackService['obstacleService']['boosters'][0].distance === previousPothole.distance).toBeFalsy();
            expect(drawTrackService['obstacleService']['boosters'][0].offset === previousPothole.offset).toBeFalsy();
        });
    });

    describe('removeIntersection() pt3', function () {

        it('should remove all obstacles if re-opening the track', () => {
            drawTrackService.removeIntersection();
            expect(drawTrackService['obstacleService']['potholes'].length).toEqual(0);
            expect(drawTrackService['obstacleService']['puddles'].length).toEqual(0);
            expect(drawTrackService['obstacleService']['boosters'].length).toEqual(0);
        });
    });

    describe('addObstacle() pt2', function () {

        it('should not add an obstacle if the track is opened', () => {
            expect(drawTrackService['obstacleService']['potholes'].length).toEqual(0);
            drawTrackService.addObstacle(ObstacleType.Pothole);
            expect(drawTrackService['obstacleService']['potholes'].length).toEqual(0);
        });
    });

    describe('saveTrack()', function () {
        it('should be able to post to the server a track and receive a response', fakeAsync(() => {
            let result: String;

            drawTrackService.saveTrack('name', 'description', 'difficulty')
                .then((serverResponse: String) => result = serverResponse);
            tick();
            expect(result).toBe('success');
        }));
    });
});
