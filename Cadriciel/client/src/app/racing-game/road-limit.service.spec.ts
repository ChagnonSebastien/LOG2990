import { RacingGameService } from './racing-game.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { LineCalculationService } from './line-calculation.service';
import { TestBed } from '@angular/core/testing';
import { RoadLimitService } from './road-limit.service';
import { HitWallEventService, HitWallEvent } from './events/hit-wall-event.service';

let roadLimitService: RoadLimitService;

describe('RoadLimitService', () => {

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [RoadLimitService, LineCalculationService, VehicleMoveEventService, RacingGameService,  HitWallEventService]
        });
        roadLimitService = TestBed.get(RoadLimitService);
    });

    it('should be created', () => {
        expect(roadLimitService).toBeDefined();
    });

});
