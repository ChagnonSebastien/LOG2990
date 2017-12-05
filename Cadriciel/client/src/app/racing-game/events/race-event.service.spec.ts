import { RaceEventService } from './race-event.service';
import { TestBed } from '@angular/core/testing';

let raceEventService: RaceEventService;

describe('test RaceService', function () {
    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: []
        });
        raceEventService = new RaceEventService();
    });
    it('construction test', () => {
        expect(raceEventService).toBeDefined();
    });
});
