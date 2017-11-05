import { Vehicle } from './vehicle';

describe('Vehicle', () => {
    const vehicle = new Vehicle();

    it('should be created', () => {
        expect(vehicle).toBeDefined();
    });

    it('should return Promise<vehicle> when 3D vehicle created', (done) => {
        vehicle.create3DVehicle(0, 0, 0).then(function(vehicle3D) {
            expect(vehicle3D).toBeDefined();
            done();
        });
    });
});
