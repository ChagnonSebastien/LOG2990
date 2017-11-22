import { RaceService } from './race.service';
import { TestBed } from '@angular/core/testing';

let raceService: RaceService;

describe('test RaceService', function () {
    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: []
        });
        raceService = new RaceService();
    });
    it('construction test', () => {
        expect(raceService).toBeDefined();
    });
});
