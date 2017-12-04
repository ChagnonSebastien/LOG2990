import { RaceEventService } from './events/race-event.service';
import { ObstacleType } from './draw-track/obstacle';
import { AudioService } from './audio.service';
import { TestBed } from '@angular/core/testing';

let audioService: AudioService;

describe('test AudioService', function () {

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [RaceEventService]
        });
        audioService = new AudioService(TestBed.get(RaceEventService));
    });

    it('construction test', () => {
        expect(audioService).toBeDefined();
    });

    it('should play the race theme and the idle engine sound', () => {
        audioService.startRace();
        expect((audioService as any).idleEngine.paused).toBe(false);
        expect((audioService as any).race.paused).toBe(false);
    });

    it('should play the countdown and engine start sounds', () => {
        audioService.startCountdown();
        expect((audioService as any).countdown.paused).toBe(false);
        expect((audioService as any).engineStart.paused).toBe(false);
    });

    it('should pause the race song', () => {
        audioService.stopRace();
        expect((audioService as any).race.paused).toBe(true);
    });

    it('should start the booster sound', () => {
        audioService.startBooster();
        expect((audioService as any).acceleratorBonusStart.paused).toBe(false);
    });

    it('should start hit pothole sound', () => {
        audioService.startHitPothole();
        expect((audioService as any).hitPothole.paused).toBe(false);
    });

    it('should start the car to car collision sound', () => {
        audioService.startCarCarCollision();
        expect((audioService as any).carCarCollision.paused).toBe(false);
    });

    it('should stop the engine acceleration sound', () => {
        audioService.engineStopAccelerate();
        expect((audioService as any).accelerate.paused).toBe(true);
    });

    it('correctly handle the hit obstacle collision event', () => {
        audioService.handleObstacleCollision(ObstacleType.Pothole);
        expect((audioService as any).hitPothole.paused).toBe(false);
        expect((audioService as any).accelerate.paused).toBe(true);
        audioService.handleObstacleCollision(ObstacleType.Booster);
        expect((audioService as any).acceleratorBonusStart.paused).toBe(false);
    });

    it('should start the hit wall sound', () => {
        audioService.carHitWall();
        expect((audioService as any).hitWall.paused).toBe(false);
    });
});
