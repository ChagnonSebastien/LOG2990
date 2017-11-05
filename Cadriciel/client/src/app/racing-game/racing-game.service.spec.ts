import { RacingGameService } from './racing-game.service';
import { RacingGameModule } from './racing-game.module';
import { TestBed, inject } from '@angular/core/testing';

let racingGameService;

describe('RacingGameService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RacingGameModule
            ],
            providers: [RacingGameService]
        });
        racingGameService = TestBed.get(RacingGameService);
    });

    it('should be created', inject([RacingGameService], (service: RacingGameService) => {
        expect(service).toBeTruthy();
    }));

    it('Should initialize main 3D vehicle', (done) => {
        racingGameService.initializeMainVehicle().then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it('Should initialize opponents 3D vehicles(3)', (done) => {
        racingGameService.initializeOpponentsVehicles().then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

});

