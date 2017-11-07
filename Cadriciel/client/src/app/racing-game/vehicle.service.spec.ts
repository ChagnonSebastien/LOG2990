import { VehicleService } from './vehicle.service';
import { TestBed, inject } from '@angular/core/testing';

let vehicleService;

describe('VehicleService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VehicleService]
        });
        vehicleService = TestBed.get(vehicleService);
    });

    it('should be created', inject([vehicleService], (service: VehicleService) => {
        expect(service).toBeTruthy();
    }));

    it('Should initialize main 3D vehicle', (done) => {
        vehicleService.initializeMainVehicle().then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

    it('Should initialize opponents 3D vehicles(3)', (done) => {
        vehicleService.initializeOpponentsVehicles().then(function(data) {
            expect(data).toBeDefined();
            done();
        });
    });

});

