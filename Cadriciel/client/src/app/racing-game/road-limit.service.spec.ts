import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { LineCalculationService } from './line-calculation.service';
import { TestBed } from '@angular/core/testing';
import { RoadLimitService } from './road-limit.service';

let roadLimitService: RoadLimitService;

describe('RoadLimitService', () => {

      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [RoadLimitService, LineCalculationService, VehicleMoveEventService]
        });
        roadLimitService = TestBed.get(RoadLimitService);
    });

    it('should be created', () => {
        expect(roadLimitService).toBeDefined();
    });

});
