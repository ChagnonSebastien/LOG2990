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

    it('should be alerted when main vehicle is initialized', () => {
        racingGameService.vehicleAlerts().subscribe((vehicle) => {
            expect(vehicle).toBeTruthy();
        });
    });

    it('should be alerted when all the opponents vehicles are initialized', () => {
        racingGameService.opponentsAlerts().subscribe((vehicle) => {
            expect(vehicle).toBeTruthy();
        });
    });

    it('PROMISE: should initialize main vehicle', (done) => {
        racingGameService.initializeVehicleTest().then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it('PROMISE: should initialize opponents vehicles(3)', (done) => {
        racingGameService.initializeOpponentsVehiclesTest().then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

});

