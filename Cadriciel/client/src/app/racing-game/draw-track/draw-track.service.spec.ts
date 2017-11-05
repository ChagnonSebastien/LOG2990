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
}

const renderServiceStub = {};
const trackValidationServiceStub = {};
const obstacleServiceStub = {
    getObstacles(type: ObstacleType): Obstacle[] {
        return [];
    }
};

let drawTrackService;

describe('DrawTrackService', function () {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                DrawTrackService,
                { provide: TrackValidationService, useValue: trackValidationServiceStub },
                { provide: RenderService, useValue: renderServiceStub },
                { provide: ObstacleService, useValue: obstacleServiceStub },
                { provide: TrackService, useClass: MockTrackService },
            ]
        });
        drawTrackService = TestBed.get(DrawTrackService);
    });

    it('should be created', () => {
        expect(drawTrackService).toBeTruthy();
    });

    it('should be able to definie if loop is closed', () => {
        drawTrackService['trackClosed'] = false;
        expect((drawTrackService as any).isFinished()).toEqual(false);
        expect(drawTrackService.isFinished()).toEqual(false);
    });

    describe('saveTrack', function () {
        it('should be able to post to the server a track and receive a response', fakeAsync(() => {
            let result: String;

            drawTrackService.saveTrack('name', 'description', 'difficulty')
                .then((serverResponse: String) => result = serverResponse);
            tick();
            expect(result).toBe('success');
        }));
    });
});
